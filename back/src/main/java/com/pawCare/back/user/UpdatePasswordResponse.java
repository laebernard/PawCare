package com.pawCare.back.user;

public class UpdatePasswordResponse {

    private final boolean success;
    private final String message;

    public UpdatePasswordResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
