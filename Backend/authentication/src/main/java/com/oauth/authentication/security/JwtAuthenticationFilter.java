package com.oauth.authentication.security;


import com.oauth.authentication.auth.repository.UserRepository;
import com.oauth.authentication.auth.utility.UserHelper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private  static final Logger logger= LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header=request.getHeader(HttpHeaders.AUTHORIZATION);
//        logger.info("Authentication header: {}",header);
        try {
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
//            logger.info("Authentication token: {}",token);
            if(!jwtService.isAccessToken(token) || jwtService.isTokenExpired(token) ) {
                filterChain.doFilter(request,response);
                return;
            }

            UUID uuid = UserHelper.parseUUID(jwtService.extractClaims(token).getSubject());
            userRepository.findById(uuid).ifPresent(user -> {
                if(user.isEnable()) {
                    List<GrantedAuthority> list = user.getRoles() == null ?
                            List.of() :
                            user.getRoles()
                                    .stream()
                                    .map(role -> new SimpleGrantedAuthority(role.getName()))
                                    .collect(Collectors.toUnmodifiableList());
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(user.getEmail(), null, list);
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    if(SecurityContextHolder.getContext().getAuthentication()==null)
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            });
        }

        }
        catch (ExpiredJwtException e){
            request.setAttribute("error","Token Expired");
        }
        catch (Exception e) {
           request.setAttribute("error","Invalid Token");
        }
        filterChain.doFilter(request,response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/api/v1/auth");
    }
}
