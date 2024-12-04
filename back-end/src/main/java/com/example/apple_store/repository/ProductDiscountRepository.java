package com.example.apple_store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.apple_store.entity.*;

@Repository
public interface ProductDiscountRepository extends JpaRepository<ProductDiscount, Long> {
    List<ProductDiscount> findByDiscountId(Long discountId);
    List<ProductDiscount> findByDiscount(Discount discount);
}