package com.example.apple_store.service;

import com.example.apple_store.entity.User;
import com.example.apple_store.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;
import java.time.LocalDateTime;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerificationCode(generateRandomCode());
        user.setVerificationCodeExpireAt(LocalDateTime.now().plusHours(24));
        User savedUser = userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());
        return savedUser;
    }

    public void verifyEmail(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerify()) {
            throw new RuntimeException("Email already verified");
        }

        if (user.getVerificationCodeExpireAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }

        if (!user.getVerificationCode().equals(code)) {
            throw new RuntimeException("Invalid verification code");
        }

        user.setVerify(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpireAt(null);
        userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        throw new RuntimeException("Invalid password");
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else {
            throw new RuntimeException("Invalid old password");
        }
    }

    public void changePasswordAdmin(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User updateUserInfo(Long userId, User updatedUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        return userRepository.save(user);
    }

    public User updateUserInfoAdmin(Long userId, User updatedUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        user.setRole(updatedUser.getRole());
        user.setVerify(updatedUser.isVerify());
        return userRepository.save(user);
    }

    public void deleteAccount(Long userId) {
        userRepository.deleteById(userId);
    }

    /// Admin functions
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    //Code random
    private String generateRandomCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    //Forget password
    public void requestResetPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resetCode = generateRandomCode();
        user.setResetPasswordCode(resetCode);
        user.setResetPasswordCodeExpireAt(LocalDateTime.now().plusMinutes(15)); 
        userRepository.save(user);

        emailService.sendResetPasswordEmail(email, resetCode);
    }

    public void verifyResetPasswordCode(String email, String resetCode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResetPasswordCodeExpireAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset code has expired");
        }

        if (!user.getResetPasswordCode().equals(resetCode)) {
            throw new RuntimeException("Invalid reset code");
        }
    }

    public void resetPassword(String email, String resetCode, String newPassword) {
        verifyResetPasswordCode(email, resetCode);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordCode(null);
        user.setResetPasswordCodeExpireAt(null);
        userRepository.save(user);
    }
}
