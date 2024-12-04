package com.example.apple_store.repository;

import com.example.apple_store.entity.CartItem;
import com.example.apple_store.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);

    @Modifying
    @Query("DELETE FROM ProductVariant v WHERE v.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);

    @Query("SELECT pv.price FROM ProductVariant pv WHERE pv.id = :id")
    Double findPriceById(@Param("id") Long id);

    Optional<CartItem> findById(Integer productVariantId);
}