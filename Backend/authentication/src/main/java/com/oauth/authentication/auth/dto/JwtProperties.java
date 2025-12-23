package com.oauth.authentication.auth.dto;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "security.jwt")
public class JwtProperties {
    private String secret;
    private String issuer;
    private long accessTtlSeconds;
    private long refreshTtlSeconds;
    private boolean cookieSecure;
    private boolean cookieHttpOnly;
    private String cookieSameSite;
}

