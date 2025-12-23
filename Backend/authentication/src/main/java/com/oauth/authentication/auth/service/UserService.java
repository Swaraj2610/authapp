package com.oauth.authentication.auth.service;

import com.oauth.authentication.auth.dto.UserDto;
import com.oauth.authentication.auth.entity.User;

import java.util.UUID;

public interface UserService {
//    Create User
    UserDto createUser(UserDto userDto);
//    Get user by email
    UserDto getUserByEmail(String email);

//    Update user
    UserDto updateUser(UserDto userDto, String userId);

//delete user
    void deleteUser(String userId);

//    get by id
    UserDto getUserById(String userId);

//    get all users
    Iterable<UserDto> getAllUsers();


}
