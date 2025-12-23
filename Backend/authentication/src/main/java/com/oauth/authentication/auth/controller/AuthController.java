package com.oauth.authentication.auth.controller;

import com.oauth.authentication.auth.dto.LoginRequest;
import com.oauth.authentication.auth.dto.RefreshTokenRequest;
import com.oauth.authentication.auth.dto.TokenResponse;
import com.oauth.authentication.auth.dto.UserDto;
import com.oauth.authentication.auth.entity.RefreshToken;
import com.oauth.authentication.auth.entity.User;
import com.oauth.authentication.auth.repository.RefreshTokenRepo;
import com.oauth.authentication.auth.repository.UserRepository;
import com.oauth.authentication.auth.service.AuthService;
import com.oauth.authentication.security.CookieService;
import com.oauth.authentication.security.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;
    private final RefreshTokenRepo refreshTokenRepo;
    private final CookieService cookieService;
//    private final RefreshTokenRepo refreshTokenRepo;
    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody @Valid UserDto userDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(userDto));
    }


    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authentication = authenticate(loginRequest);
        if (!authentication.isAuthenticated()) throw new BadCredentialsException("User not authenticated");
        User user = userRepository.findByEmail(loginRequest.email()).orElseThrow(() -> new BadCredentialsException("Invalid Username or Password"));
        if (!user.isEnable()) throw new DisabledException("User id disable");

        String jti= UUID.randomUUID().toString();
        var refreshTokenOb= RefreshToken.builder()
                .jti(jti)
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .revoked(false)
                .build();
        refreshTokenRepo.save(refreshTokenOb);
        String token = jwtService.generateToken(user);
        String refreshToken=jwtService.refreshToken(user,refreshTokenOb.getJti());
        cookieService.attachRefreshCookie(response,refreshToken,(int)jwtService.getRefreshTtlSeconds());
        cookieService.addNoHeaders(response);
        return ResponseEntity.ok(TokenResponse.of(token, refreshToken, jwtService.getAccessTtlSeconds(), modelMapper.map(user, UserDto.class)));
    }

    private Authentication authenticate(LoginRequest loginRequest) {
        try {
            return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.email(), loginRequest.passowrd()
            ));
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid Username or Password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(  HttpServletRequest request, HttpServletResponse response){
        redRefreshTokenFromRequest(null,request).ifPresent(token->{
           try {
               if(jwtService.isRefreshToken(token)){
                   String jti= jwtService.getJti(token);
                   refreshTokenRepo.findByJti(jti).ifPresent(rt->{
                       rt.setRevoked(true);
                       refreshTokenRepo.save(rt);
                   });
               }
           } catch (JwtException _) {

           }
        });

        cookieService.clearRefreshCookie(response);
        cookieService.addNoHeaders(response);
        SecurityContextHolder.createEmptyContext();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @PostMapping("/refreshToken")
    public ResponseEntity<TokenResponse> renewRefreshToken(@CookieValue("refreshToken") String refreshTokenInp,
                                                           HttpServletRequest request,
                                                           HttpServletResponse response){
        String refreshToken=redRefreshTokenFromRequest(refreshTokenInp,request).orElseThrow(()-> new BadCredentialsException("refresh token missing"));
        if(!jwtService.isRefreshToken(refreshToken))throw new BadCredentialsException("Invalid Refresh Token Type");

        String jti=jwtService.getJti(refreshToken);
        UUID uuid=jwtService.getUserId(refreshToken);

       RefreshToken storedToken= refreshTokenRepo.findByJti(jti)
               .orElseThrow(()->new BadCredentialsException("Invalid Credentials username or password"));

       if (storedToken.isRevoked())throw new BadCredentialsException("Refresh token revoked or expired");
       if (storedToken.getExpiresAt().isBefore(Instant.now()))throw new BadCredentialsException("Refresh token expired");
       if (!storedToken.getUser().getId().equals(uuid))throw new BadCredentialsException("Refresh token does not belongs to this user");
        storedToken.setRevoked(true);
        String newJti=UUID.randomUUID().toString();
        storedToken.setReplacedByToken(newJti);
        refreshTokenRepo.save(storedToken);

        User user=storedToken.getUser();

        var newRefreshTokenOb=RefreshToken.builder()
                .jti(newJti)
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .revoked(false)
                .build();
        refreshTokenRepo.save(newRefreshTokenOb);

        String newAccessToken= jwtService.generateToken(user);
        String newRefreshToken= jwtService.refreshToken(user,newJti);
        cookieService.attachRefreshCookie(response,newRefreshToken,(int) jwtService.getRefreshTtlSeconds());
        cookieService.addNoHeaders(response);
        return ResponseEntity.ok(TokenResponse.of(newAccessToken, newRefreshToken, jwtService.getAccessTtlSeconds(),modelMapper.map(user, UserDto.class)));
    }

    private Optional<String> redRefreshTokenFromRequest(String refreshTokenInp, HttpServletRequest request) {
        if(request.getCookies()!=null){
           return Arrays.stream(request.getCookies())
                    .filter(cookie-> cookieService.getRefreshTokenCookieName().equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .filter(StringUtils::hasText)
                    .findFirst();
        }
       if(StringUtils.hasText(refreshTokenInp)){
        return Optional.of(refreshTokenInp);
       }
       return Optional.empty();
    }


}
