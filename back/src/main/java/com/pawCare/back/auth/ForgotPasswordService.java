package com.pawCare.back.auth;

import com.pawCare.back.security.PasswordPolicy;
import com.pawCare.back.user.User;
import com.pawCare.back.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class ForgotPasswordService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ForgotPasswordService.class);
    private static final Pattern EMAIL_REGEX = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final int RESET_TOKEN_TTL_MINUTES = 30;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${app.reset-password-url:http://localhost:4200/reset-password}")
    private String resetPasswordUrl;

    @Value("${app.mail.from:no-reply@pawcare.local}")
    private String mailFrom;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${spring.mail.port:}")
    private String mailPort;

    public ForgotPasswordService(
            UserRepository userRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            JavaMailSender mailSender
    ) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.mailSender = mailSender;
    }

    public ResponseEntity<ForgotPasswordResponse> forgotPassword(ForgotPasswordRequest request) {
        String email = request != null && request.getEmail() != null ? request.getEmail().trim() : "";

        if (email.isBlank()) {
            return ResponseEntity.badRequest().body(new ForgotPasswordResponse(false, "champs obligatoire"));
        }

        if (!EMAIL_REGEX.matcher(email).matches()) {
            return ResponseEntity.badRequest().body(new ForgotPasswordResponse(false, "email invalide"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        userOpt.ifPresent(this::createAndLogResetToken);

        return ResponseEntity.ok(new ForgotPasswordResponse(true,
                "Si cet email existe, un lien de reinitialisation a ete envoye."));
    }

    @Transactional
    public ResponseEntity<ForgotPasswordResponse> resetPassword(ResetPasswordRequest request) {
        String token = request != null && request.getToken() != null ? request.getToken().trim() : "";
        String newPassword = request != null && request.getPassword() != null ? request.getPassword() : "";

        if (token.isBlank()) {
            return ResponseEntity.badRequest().body(new ForgotPasswordResponse(false, "Token de reinitialisation manquant"));
        }

        if (newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(new ForgotPasswordResponse(false, "champs obligatoire"));
        }

        if (!PasswordPolicy.isValid(newPassword)) {
            return ResponseEntity.badRequest().body(new ForgotPasswordResponse(false, PasswordPolicy.ERROR_MESSAGE));
        }

        Optional<PasswordResetToken> resetTokenOpt = passwordResetTokenRepository.findByTokenAndUsedFalse(token);
        if (resetTokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ForgotPasswordResponse(false, "Token invalide"));
        }

        PasswordResetToken resetToken = resetTokenOpt.get();
        if (LocalDateTime.now().isAfter(resetToken.getExpiresAt())) {
            return ResponseEntity.badRequest().body(new ForgotPasswordResponse(false, "Token expire"));
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return ResponseEntity.ok(new ForgotPasswordResponse(true, "Mot de passe reinitialise avec succes"));
    }

    private void createAndLogResetToken(User user) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(RESET_TOKEN_TTL_MINUTES);

        PasswordResetToken resetToken = new PasswordResetToken(user, token, expiresAt);
        passwordResetTokenRepository.save(resetToken);

        String link = resetPasswordUrl + "?token=" + token;
        try {
            sendResetPasswordEmail(user.getEmail(), link);
            LOGGER.info("Reset password link for {}: {}", user.getEmail(), link);
        } catch (RuntimeException ex) {
            passwordResetTokenRepository.delete(resetToken);
            throw ex;
        }
    }

    private void sendResetPasswordEmail(String toEmail, String resetLink) {
        if (mailHost == null || mailHost.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "MAIL_HOST is not configured for password reset emails"
            );
        }

        if (mailUsername == null || mailUsername.isBlank() || mailPassword == null || mailPassword.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "SMTP credentials are not configured (MAIL_USERNAME / MAIL_PASSWORD)"
            );
        }

        try {
            String senderAddress = resolveSenderAddress();
            LOGGER.info(
                    "Sending reset password email via host={}, port={}, from={}, username={} to {}",
                    mailHost,
                    mailPort,
                    senderAddress,
                    mailUsername,
                    toEmail
            );

            var mimeMessage = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setFrom(senderAddress);
            helper.setTo(toEmail);
            helper.setSubject("Reinitialisation de votre mot de passe PawCare");

            String html = """
                    <p>Bonjour,</p>
                    <p>Vous avez demande une reinitialisation de mot de passe.</p>
                    <p>
                      <a href=\"%s\" style=\"display:inline-block;padding:10px 16px;background:#ff8885;color:#ffffff;text-decoration:none;border-radius:9999px;font-weight:600;\">Reinitialiser mon mot de passe</a>
                    </p>
                    <p>Ce lien est valide 30 minutes.</p>
                    <p>Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>
                    """.formatted(resetLink);

            helper.setText(html, true);
            mailSender.send(mimeMessage);
    } catch (MailAuthenticationException ex) {
        LOGGER.error("SMTP authentication failed for host={}, port={}, username={}", mailHost, mailPort, mailUsername, ex);
        throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "SMTP authentication failed"
        );
    } catch (MailSendException ex) {
        LOGGER.error("SMTP send failed for host={}, port={}, from={}, username={}", mailHost, mailPort, resolveSenderAddress(), mailUsername, ex);
        throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "SMTP send failed"
        );
        } catch (Exception ex) {
        LOGGER.error("Failed to send reset password email to {} via host={}, port={}, from={}, username={}", toEmail, mailHost, mailPort, resolveSenderAddress(), mailUsername, ex);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to send reset password email"
            );
        }
    }

    private String resolveSenderAddress() {
        String configuredFrom = mailFrom != null ? mailFrom.trim() : "";
        String username = mailUsername != null ? mailUsername.trim() : "";

        if (configuredFrom.isBlank()) {
            return username;
        }

        // Gmail often rejects a "From" different from the authenticated account.
        if (mailHost != null && mailHost.toLowerCase().contains("gmail")
                && !username.isBlank()
                && !configuredFrom.equalsIgnoreCase(username)) {
            LOGGER.warn("MAIL_FROM ({}) differs from MAIL_USERNAME on Gmail SMTP; using MAIL_USERNAME instead", configuredFrom);
            return username;
        }

        return configuredFrom;
    }
}
