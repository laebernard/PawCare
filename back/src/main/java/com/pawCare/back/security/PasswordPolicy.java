package com.pawCare.back.security;

import java.util.regex.Pattern;

public final class PasswordPolicy {

    public static final String ERROR_MESSAGE =
            "Le mot de passe doit contenir au moins 8 caracteres, une majuscule, une minuscule, un chiffre et un symbole";

    private static final Pattern PASSWORD_REGEX =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$");

    private PasswordPolicy() {
    }

    public static boolean isValid(String password) {
        return password != null && PASSWORD_REGEX.matcher(password).matches();
    }
}
