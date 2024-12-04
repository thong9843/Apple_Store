package com.example.apple_store.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "product_variants")
@Data
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(name = "variant_name")
    private String variantName;
    private BigDecimal price;
    @Column(name = "stock_quantity")
    private Integer stockQuantity;
    @Column(name = "is_available")
    private Boolean isAvailable;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}