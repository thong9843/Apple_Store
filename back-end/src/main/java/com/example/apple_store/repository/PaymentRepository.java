package com.example.apple_store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import com.example.apple_store.entity.*;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);
    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);
    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);
}