package com.pawCare.back.user;

public class UpdateUserResponse {

    private final boolean success;
    private final String message;
    private final UserPublicResponse user;

    public UpdateUserResponse(boolean success, String message, UserPublicResponse user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public UserPublicResponse getUser() {
        return user;
    }
}
