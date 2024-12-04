package com.example.apple_store.entity;

import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
@Table(name = "discounts")
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Discount code is required")
    @Column(unique = true, nullable = false)
    private String discountCode;
    
    private String description;
    
    @NotNull(message = "Discount type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;
    
    @NotNull(message = "Discount value is required")
    @Column(nullable = false)
    private BigDecimal discountValue;
    
    @NotNull(message = "Start date is required")
    @Column(nullable = false)
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    @Column(nullable = false)
    private LocalDate endDate;
    
    private BigDecimal minOrderValue;
    
    private BigDecimal maxDiscountAmount;
    
    private Integer usageLimit;
    
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

    @NotNull(message = "Discount scope is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountScope discountScope;
    
    @OneToMany(mappedBy = "discount", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProductDiscount> productDiscounts;

    public List<ProductDiscount> getProductDiscounts() {
        return productDiscounts;
    }
}