package com.oauth.authentication.auth.dto;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ErrorResponse(
        HttpStatus status,
        String error,
        String message,
//        String path,
        LocalDateTime timestamp
) {}
