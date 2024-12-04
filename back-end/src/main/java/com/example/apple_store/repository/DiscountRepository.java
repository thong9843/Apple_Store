package com.example.apple_store.repository;

import com.example.apple_store.entity.Discount;
import com.example.apple_store.entity.DiscountScope;
import com.example.apple_store.entity.DiscountType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    List<Discount> findByDiscountType(DiscountType discountType);
    List<Discount> findByDiscountScope(DiscountScope discountScope);
    Optional<Discount> findByDiscountCode(String discountCode);
    
}