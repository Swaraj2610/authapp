package com.oauth.authentication.auth.dto;


import lombok.*;

import java.util.UUID;
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Data
public class RoleDto {

    private UUID id;
    private String name;
}
