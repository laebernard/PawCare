package com.pawCare.back.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    private final boolean success;
    private final String message;

    public ApiError(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}
