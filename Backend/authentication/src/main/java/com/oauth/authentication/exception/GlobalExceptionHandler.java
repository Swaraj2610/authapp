package com.oauth.authentication.exception;
import com.oauth.authentication.auth.dto.ApiError;
import com.oauth.authentication.auth.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private final Logger logger= LoggerFactory.getLogger(GlobalExceptionHandler.class);
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException exception){
      ErrorResponse errorResponse= new ErrorResponse(HttpStatus.NOT_FOUND,exception.getMessage(),exception.getClass().getSimpleName(), LocalDateTime.now());
      return ResponseEntity.status(404).body(errorResponse);
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentExceptionException(IllegalArgumentException exception){
        ErrorResponse errorResponse= new ErrorResponse(HttpStatus.BAD_REQUEST,exception.getMessage(),exception.getClass().getSimpleName(), LocalDateTime.now());
        return ResponseEntity.badRequest().body(errorResponse);
    }


    @ExceptionHandler({
            UsernameNotFoundException.class,
            BadCredentialsException.class,
            CredentialsExpiredException.class,
            DisabledException.class
    })
    public ResponseEntity<ApiError> handleAuthExceptions(Exception exception, HttpServletRequest request) {
        logger.info("Exception: {}" ,exception.getClass().getSimpleName());
        var apiError = ApiError.of(
                HttpStatus.BAD_REQUEST.value(),
                "Authentication failed",
                exception.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

}
