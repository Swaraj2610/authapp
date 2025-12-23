package com.oauth.authentication.auth.dto;


import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Data
public class UserDto {


    private UUID id;
    private String email;
    private String name;
    private String password;
    private String image;
    private boolean enable=true;
    private Instant createdAt=Instant.now();
    private Instant updatedAt=Instant.now();
    private Provider provide=Provider.LOCAL;
    private Set<RoleDto> roles=new HashSet<>();
}
