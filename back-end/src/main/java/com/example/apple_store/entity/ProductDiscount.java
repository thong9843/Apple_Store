package com.example.apple_store.entity;

import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "product_discounts")
public class ProductDiscount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Discount is required")
    @ManyToOne
    @JoinColumn(name = "discount_id", nullable = false)
    @JsonBackReference
    private Discount discount;
    
    @NotNull(message = "Product is required")
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @ManyToOne
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;
    
    @JsonIgnore
    private LocalDateTime createdAt;
    
    @JsonIgnore
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getProductId() {
        return product != null ? product.getId() : null;
    }
}