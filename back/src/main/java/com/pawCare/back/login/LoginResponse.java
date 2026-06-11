package com.pawCare.back.login;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.pawCare.back.auth.UserPayload;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {

    private final boolean success;
    private final String message;
    private final LoginData data;
    private final UserPayload user;

    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
        this.user = null;
    }

    public LoginResponse(boolean success, String message, LoginData data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.user = null;
    }

    public LoginResponse(boolean success, String message, LoginData data, UserPayload user) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.user = user;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public LoginData getData() { return data; }
    public UserPayload getUser() { return user; }
}