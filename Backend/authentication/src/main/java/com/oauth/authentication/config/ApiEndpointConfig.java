package com.oauth.authentication.config;

public class ApiEndpointConfig {
    public static final String[] AUTH_PUBLIC_URL={
            "/api/v1/auth/**",
            "/api/v1/auth/refreshToken",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**"
    };
}
