package com.example.apple_store.repository;

import com.example.apple_store.entity.ShippingAddress;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long> {
    List<ShippingAddress> findByUserId(Long userId);
    ShippingAddress findByUserIdAndId(Long userId, Long addressId);
}