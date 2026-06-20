package com.pawCare.back.security;

import com.pawCare.back.login.JwtUtil;
import com.pawCare.back.user.User;
import com.pawCare.back.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Reads the {@code jwt} HttpOnly cookie on every request, validates it, and
 * populates Spring's {@link SecurityContextHolder} with the owning
 * {@link User}. Requests without a valid token simply keep an empty security
 * context — the {@link SecurityConfig} filter chain decides whether the
 * route is public or requires authentication.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String JWT_COOKIE_NAME = "jwt";

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String token = extractJwtCookie(request);
        if (token != null && !token.isBlank()) {
            String email = jwtUtil.extractEmail(token);
            if (email != null) {
                userRepository.findByEmail(email).ifPresent(user ->
                    SecurityContextHolder.getContext().setAuthentication(
                            new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority("ROLE_USER")))
                    )
                );
            }
        }

        chain.doFilter(request, response);
    }

    private static String extractJwtCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        return Arrays.stream(cookies)
                .filter(c -> JWT_COOKIE_NAME.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
