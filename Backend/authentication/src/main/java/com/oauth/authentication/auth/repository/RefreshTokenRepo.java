package com.oauth.authentication.auth.repository;

import com.oauth.authentication.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface RefreshTokenRepo extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByJti(String jti);
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId")
    void deleteByUserId(UUID userId);
}
