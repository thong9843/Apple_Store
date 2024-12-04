package com.example.apple_store.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    private String address;

    @Enumerated(EnumType.STRING)
    private Role role = Role.customer;

    private boolean isVerify = false;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String verificationCode;
    private LocalDateTime verificationCodeExpireAt;
    private String resetPasswordCode;
    private LocalDateTime resetPasswordCodeExpireAt;

    public enum Role {
        customer, admin
    }
}

