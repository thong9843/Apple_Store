package com.example.apple_store.controller;

import com.example.apple_store.entity.User;
import com.example.apple_store.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestParam String email, @RequestParam String password) {
        return ResponseEntity.ok(userService.login(email, password));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestParam Long userId, @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        userService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/change-password")
    public ResponseEntity<?> changePasswordAdmin(@RequestParam Long userId, @RequestParam String newPassword) {
        userService.changePasswordAdmin(userId, newPassword);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUserInfo(@PathVariable Long userId, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUserInfo(userId, updatedUser));
    }

    @PutMapping("/admin/{userId}")
    public ResponseEntity<User> updateUserInfoAdmin(@PathVariable Long userId, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUserInfoAdmin(userId, updatedUser));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long userId) {
        userService.deleteAccount(userId);
        return ResponseEntity.ok().build();
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/admin/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String email, @RequestParam String code) {
        userService.verifyEmail(email, code);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request-reset-password")
    public ResponseEntity<?> requestResetPassword(@RequestParam String email) {
        userService.requestResetPassword(email);
        return ResponseEntity.ok().body("Reset password code has been sent to your email");
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(
            @RequestParam String email,
            @RequestParam String resetCode) {
        userService.verifyResetPasswordCode(email, resetCode);
        return ResponseEntity.ok().body("Reset code is valid");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String email,
            @RequestParam String resetCode,
            @RequestParam String newPassword) {
        userService.resetPassword(email, resetCode, newPassword);
        return ResponseEntity.ok().body("Password has been reset successfully");
    }
}