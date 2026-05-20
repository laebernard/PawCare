package com.pawCare.back.login;

import com.pawCare.back.user.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
        var userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return new LoginResponse(false, "Aucun compte associé à cet email");
        }

        var user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse(false, "Mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        LoginData data = new LoginData(token, user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
        return new LoginResponse(true, "Connexion réussie", data);
    }
}
