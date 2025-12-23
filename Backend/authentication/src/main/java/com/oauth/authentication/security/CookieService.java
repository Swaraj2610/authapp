package com.oauth.authentication.security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Getter
@Service
public class CookieService {
    private final String refreshTokenCookieName;
    private final boolean cookieSecure;
    private final boolean cookieHttpOnly;
    private final String cookieDomain;
    private final  String cookieSameSite;

    private final Logger  logger= LoggerFactory.getLogger(CookieService.class);

    public CookieService(
            @Value("${security.jwt.refresh-token-cookie-name}") String refreshTokenCookieName,
            @Value("${security.jwt.cookie-http-only}") boolean cookieHttpOnly,
            @Value("${security.jwt.cookie-secure}") boolean cookieSecure,
            @Value("${security.jwt.cookie-domain}")  String cookieDomain,
            @Value("${security.jwt.cookie-same-site}") String cookieSameSite
        ) {
        this.refreshTokenCookieName = refreshTokenCookieName;
        this.cookieHttpOnly = cookieHttpOnly;
        this.cookieSecure = cookieSecure;
        this.cookieDomain = cookieDomain;
        this.cookieSameSite = cookieSameSite;
    }

    public void attachRefreshCookie(HttpServletResponse httpServletResponse,String value,int maxAge){

        logger.info("Attached with cookie: {} and value: {}",refreshTokenCookieName,value);
       var responseCookieBuilder= ResponseCookie.from(refreshTokenCookieName,value)
                .httpOnly(cookieHttpOnly)
                .secure(cookieSecure)
                .path("/")
                .maxAge(maxAge)
                .sameSite(cookieSameSite);

       if(StringUtils.hasText(cookieDomain)){
           responseCookieBuilder.domain(cookieDomain);
       }

       var responseCookie=responseCookieBuilder.build();

       httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }


    public void clearRefreshCookie(HttpServletResponse httpServletResponse){
        var responseCookieBuilder=ResponseCookie.from(refreshTokenCookieName,"")
                .maxAge(0)
                .httpOnly(cookieHttpOnly)
                .path("/")
                .sameSite(cookieSameSite)
                .secure(cookieSecure);
        if(StringUtils.hasText(cookieDomain)){
            responseCookieBuilder.domain(cookieDomain);
        }
        var responseCookie=responseCookieBuilder.build();
        httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }


    public void addNoHeaders(HttpServletResponse response){
        response.setHeader(HttpHeaders.CACHE_CONTROL,"no-store");
        response.setHeader("Pragma","no-cache");
    }

}
