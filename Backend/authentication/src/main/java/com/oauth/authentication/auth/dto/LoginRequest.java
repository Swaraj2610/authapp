package com.oauth.authentication.auth.dto;

public record LoginRequest(
        String email,
        String passowrd

) {
}
