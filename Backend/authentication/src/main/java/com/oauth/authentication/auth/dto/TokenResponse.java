package com.oauth.authentication.auth.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        String tokenTyp,
        long expiresIn,
        UserDto userDto
) {
    public static  TokenResponse of(String accessToken, String refreshToken, long expiresIn, UserDto userDto) {
     return new TokenResponse(accessToken, refreshToken, "Bearer", expiresIn, userDto);
    }
}
