package com.oauth.authentication.security;


import com.oauth.authentication.auth.dto.Provider;
import com.oauth.authentication.auth.entity.RefreshToken;
import com.oauth.authentication.auth.entity.User;
import com.oauth.authentication.auth.repository.RefreshTokenRepo;
import com.oauth.authentication.auth.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final CookieService cookieService;
    private final RefreshTokenRepo refreshTokenRepo;
    private final GithubEmailService githubEmailService;
    @Value("${app.auth.frontend.success-redirect}")
    private String frontendSuccessUrl;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Transactional
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        logger.info("Successful Authentication");
        logger.info(authentication.toString());

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = "unknown";

        if (authentication instanceof OAuth2AuthenticationToken token)
            registrationId = token.getAuthorizedClientRegistrationId();

        logger.info("registrationId: {}", registrationId);
//        assert oAuth2User != null;
        logger.info("user: {}", oAuth2User.getAttributes().toString());
        User user;
        switch (registrationId) {
            case "google" -> {
                String googleId = oAuth2User.getAttributes().getOrDefault("sub", "").toString();
                String email = oAuth2User.getAttributes().getOrDefault("email", "").toString();
                String name = oAuth2User.getAttributes().getOrDefault("name", "").toString();
                String picture = oAuth2User.getAttributes().getOrDefault("picture", "").toString();
                user = setUser(email, name, picture, googleId,Provider.GOOGLE);
            }
            case "github" -> {
                String email = oAuth2User.getAttribute("email")==null?githubEmailService.fetchPrimaryEmail(oAuth2User):oAuth2User.getAttribute("email");
                String name = oAuth2User.getAttribute("name")==null?"github-user-" + oAuth2User.getAttribute("id"):oAuth2User.getAttribute("name");
                String picture = oAuth2User.getAttributes().getOrDefault("avatar_url", "").toString();
                logger.info("github image: {}",picture);
                String gitHubId = oAuth2User.getAttributes().getOrDefault("id", "").toString();
                user = setUser(email, name, picture, gitHubId,Provider.GITHUB);

            }
            default -> throw new RuntimeException("Invalid provider");
        }
        String jti = UUID.randomUUID().toString();
        logger.info("Login JTI: {}", jti);
        RefreshToken refreshTokenOb = RefreshToken.builder()
                .jti(jti)
                .user(user)
                .revoked(false)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .build();

        refreshTokenRepo.save(refreshTokenOb);

        String refreshTokens = jwtService.refreshToken(user, refreshTokenOb.getJti());
        cookieService.attachRefreshCookie(response, refreshTokens, (int) jwtService.getRefreshTtlSeconds());
        response.sendRedirect(frontendSuccessUrl);
    }

    private User setUser(String email, String name, String picture, String providerId,Provider provider) {
        User user;
        User newUser = userRepository.findByEmail(email)
                .map(existineUser->{
                    existineUser.setName(name);
                    existineUser.setImage(picture);
                    existineUser.setProvide(provider);
                    existineUser.setProviderId(providerId);
                    return existineUser;
                })
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email(email)
                                .name(name)
                                .image(picture)
                                .provide(provider)
                                .providerId(providerId)
                                .enable(true)
                                .build()
                ));

        user=  saveUserDetails(email, newUser);
        return user;
    }

    private User saveUserDetails(String email, User user) {
       return userRepository.findByEmail(email).
               map(existing -> {
            existing.setName(user.getName());
            existing.setImage(user.getImage());
            existing.setProvide(user.getProvide());
            existing.setProviderId(user.getProviderId());
            return userRepository.save(existing);
        }).orElseGet(()->userRepository.save(user));
    }

}
