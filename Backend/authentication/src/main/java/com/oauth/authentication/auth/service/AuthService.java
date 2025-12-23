package com.oauth.authentication.auth.service;

import com.oauth.authentication.auth.dto.UserDto;

public interface AuthService {
    UserDto registerUser(UserDto userDto);
}
