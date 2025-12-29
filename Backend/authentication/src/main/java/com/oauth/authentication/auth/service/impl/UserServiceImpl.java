package com.oauth.authentication.auth.service.impl;

import com.oauth.authentication.auth.dto.Provider;
import com.oauth.authentication.auth.dto.UserDto;
import com.oauth.authentication.auth.entity.User;
import com.oauth.authentication.auth.repository.RefreshTokenRepo;
import com.oauth.authentication.auth.repository.UserRepository;
import com.oauth.authentication.auth.service.UserService;
import com.oauth.authentication.auth.utility.UserHelper;
import com.oauth.authentication.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final RefreshTokenRepo refreshTokenRepo;

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        if (userDto.getEmail() == null || userDto.getEmail().isBlank())
            throw new IllegalArgumentException("Email is required");
        if (userRepository.existsByEmail(userDto.getEmail()))
            throw new IllegalArgumentException("Email already exists");
        User user = modelMapper.map(userDto, User.class);
        user.setProvide(userDto.getProvide() != null ? userDto.getProvide() : Provider.LOCAL);
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDto.class);
    }

    @Override
    public UserDto getUserByEmail(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with given email"));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public UserDto updateUser(UserDto userDto, String userId) {
        User existingUser = userRepository.findById(UserHelper.parseUUID(userId)).orElseThrow(() -> new ResourceNotFoundException("User not found with give ID"));
        if(userDto.getName()!=null)existingUser.setName(userDto.getName());
        if(userDto.getImage()!=null)existingUser.setImage(userDto.getImage());
        if(userDto.getProvide()!=null)existingUser.setProvide(userDto.getProvide());
        existingUser.setEnable(userDto.isEnable());
//        auth pass update logic must be change
        if(userDto.getPassword()!=null)existingUser.setPassword(userDto.getPassword());
        return modelMapper.map(userRepository.save(existingUser),UserDto.class);
    }

    @Override
    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(UserHelper.parseUUID(userId)).orElseThrow(() -> new ResourceNotFoundException("User not found with give ID"));
        refreshTokenRepo.deleteByUserId(user.getId());
        userRepository.delete(user);
    }

    @Override
    public UserDto getUserById(String userId) {
        return modelMapper
                .map(userRepository
                        .findById(UserHelper.parseUUID(userId))
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with give ID")),
                        UserDto.class);
    }

    @Override
    @Transactional(readOnly = true)
    public Iterable<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .toList();
    }


}
