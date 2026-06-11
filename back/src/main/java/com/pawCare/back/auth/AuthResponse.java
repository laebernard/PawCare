package com.pawCare.back.auth;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    private final boolean success;
    private final String message;
    private final UserPayload user;

    private AuthResponse(boolean success, String message, UserPayload user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    public static AuthResponse ok(UserPayload user) {
        return new AuthResponse(true, null, user);
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(false, message, null);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public UserPayload getUser() { return user; }
}