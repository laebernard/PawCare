package com.pawCare.back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final List<String> allowedOrigins;

    public CorsConfig(@Value("${cors.allowed-origins}") String allowedOriginsCsv) {
        this.allowedOrigins = List.of(allowedOriginsCsv.split("\\s*,\\s*"))
                .stream()
                .map(this::normalizeOrigin)
                .filter(origin -> !origin.isBlank())
                .collect(Collectors.toList());
    }

    private String normalizeOrigin(String origin) {
        if (origin == null) {
            return "";
        }

        String normalized = origin.trim();
        if ((normalized.startsWith("\"") && normalized.endsWith("\""))
                || (normalized.startsWith("'") && normalized.endsWith("'"))) {
            normalized = normalized.substring(1, normalized.length() - 1).trim();
        }

        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }

        return normalized;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.toArray(String[]::new))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    /**
     * Exposed as a bean so Spring Security can pick it up and apply CORS
     * BEFORE its own filter rejects the request. The MVC {@code WebMvcConfigurer}
     * alone is not enough when spring-security is on the classpath.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
