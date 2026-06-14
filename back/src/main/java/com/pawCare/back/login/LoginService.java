package com.pawCare.back.login;

import com.pawCare.back.auth.UserPayload;
import com.pawCare.back.user.User;
import com.pawCare.back.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LoginService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public LoginService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Aucun compte associé à cet email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        LoginData data = new LoginData(token, user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
        UserPayload userPayload = new UserPayload(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());

        return new LoginResponse(true, "Connexion réussie", data, userPayload);
    }
}
