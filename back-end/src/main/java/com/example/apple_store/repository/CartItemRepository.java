package com.example.apple_store.repository;

import com.example.apple_store.entity.CartItem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    void deleteByCartIdAndProductVariantId(Long cartId, Long productVariantId);

    List<CartItem> findByCartId(Long cartId);
}