package com.pawCare.back.auth;

import com.pawCare.back.user.User;
import com.pawCare.back.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(new ForgotPasswordResponse(false, "Le mot de passe doit contenir au moins 8 caracteres"));
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

        try {
            var mimeMessage = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setFrom(mailFrom);
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
        } catch (Exception ex) {
            LOGGER.error("Failed to send reset password email to {}", toEmail, ex);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to send reset password email"
            );
        }
    }
}
