package com.example.apple_store.repository;

import com.example.apple_store.entity.*;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    Optional<Order> findById(Long id);
    List<Order> findByOrderStatus(OrderStatus status);
    List<Order> findByPaymentConfirm(PaymentConfirm status);
    List<Order> findByUserIdAndOrderStatus(Long userId, OrderStatus status);
    List<Order> findByUserIdAndPaymentConfirm(Long userId, PaymentConfirm status);
}