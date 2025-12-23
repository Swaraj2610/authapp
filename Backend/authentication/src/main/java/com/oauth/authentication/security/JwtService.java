package com.oauth.authentication.security;

import com.oauth.authentication.auth.dto.JwtProperties;
import com.oauth.authentication.auth.entity.Role;
import com.oauth.authentication.auth.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
@Getter
@Setter
@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long accessTtlSeconds;
    private final long refreshTtlSeconds;
    private final String issuer;

    public JwtService(@Value("${security.jwt.secret}") String secret ,
                      @Value("${security.jwt.access-ttl-seconds}")  long accessTtlSeconds,
                      @Value("${security.jwt.refresh-ttl-seconds}") long refreshTtlSeconds,
                      @Value("${security.jwt.issuer}") String issuer) {
        if(secret==null || secret.length()<64)throw new IllegalArgumentException("Invalid secret");
        this.secretKey= Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTtlSeconds = accessTtlSeconds;
        this.refreshTtlSeconds = refreshTtlSeconds;
        this.issuer = issuer;
    }

    public String generateToken(User user){
        Instant instant=Instant.now();
        List<String> roles=user.getRoles().stream().map(Role::getName).toList();
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(user.getId().toString())
                .issuer(issuer)
                .issuedAt(Date.from(instant))
                .expiration(Date.from(instant.plusSeconds(accessTtlSeconds)))
                .claims(Map.of(
                        "email",user.getEmail(),
                        "roles",roles,
                        "typ","access"
                ))
                .signWith(secretKey,Jwts.SIG.HS512)
                .compact();
    }

    public String refreshToken(User user, String jti){
        Instant instant=Instant.now();
        List<String> roles=user.getRoles().stream().map(Role::getName).toList();
        return Jwts.builder()
                .id(jti)
                .subject(user.getId().toString())
                .issuer(issuer)
                .issuedAt(Date.from(instant))
                .expiration(Date.from(instant.plusSeconds(refreshTtlSeconds)))
                .claims(Map.of(
                        "email",user.getEmail(),
                        "roles",roles,
                        "typ","refresh"
                ))
                .signWith(secretKey,Jwts.SIG.HS512)
                .compact();
    }

    public Claims extractClaims(String token){
                   return Jwts
                    .parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

    }

    public boolean isAccessToken(String token){
        Claims claims=extractClaims(token);
        return "access".equals(claims.get("typ")) ;
    }

    public boolean isRefreshToken(String token){
        Claims claims=extractClaims(token);
        return "refresh".equals(claims.get("typ"));
    }


    public String getJti(String token){
        return extractClaims(token).getId();

    }

    public boolean isTokenExpired(String token){
        return extractClaims(token).getExpiration().before(new Date());
    }
    public UUID getUserId(String token) {
        Claims claims = extractClaims(token);
        String userId = claims.getSubject();
        return UUID.fromString(userId);
    }
}
