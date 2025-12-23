package com.oauth.authentication.auth.entity;

import com.oauth.authentication.auth.dto.Provider;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Data
@Builder
@Entity
@Table(name = "auth_user",schema = "auth_login")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="user_id",updatable = false,nullable = false)
    private UUID id;
    @Column(name="user_email",nullable = false,unique = true ,length = 300)
    private String email;
    @Column(name="user_name",nullable = false,unique = true ,length = 500)
    private String name;
    @Column(nullable = false)
    private String password;
    private String image;
    @Column(nullable = false)
    private boolean enable=true;
    private Instant createdAt=Instant.now();
    private Instant updatedAt=Instant.now();
    @Enumerated(EnumType.STRING)
    private Provider provide=Provider.LOCAL;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        schema = "auth_login",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles=new HashSet<>();

    @PrePersist
    protected void onCreate() {
        if(createdAt==null)createdAt=Instant.now();
        updatedAt=Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return roles
                .stream()
                .map(role->new SimpleGrantedAuthority(role.getName()))
                .toList();
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enable;
    }
}
