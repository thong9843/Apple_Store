package com.example.apple_store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.apple_store.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
