package com.oauth.authentication.auth.service.impl;


import com.oauth.authentication.auth.dto.UserDto;
import com.oauth.authentication.auth.service.AuthService;
import com.oauth.authentication.auth.service.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder encoder;
    @Override
    public UserDto registerUser(UserDto userDto) {
        userDto.setPassword(encoder.encode(userDto.getPassword()));
       UserDto userDto1= userService.createUser(userDto);
        return  userDto1;
    }
}
