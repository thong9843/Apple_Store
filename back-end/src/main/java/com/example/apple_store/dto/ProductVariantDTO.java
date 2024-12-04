package com.example.apple_store.dto;
import java.math.BigDecimal;

public class ProductVariantDTO {
    private Long productId;
    private String variantName;
    private BigDecimal price;
    private Integer stockQuantity;
    private Boolean isAvailable;
    // getters and setters
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public String getVariantName() {
        return variantName;
    }
    public void setVariantName(String variantName) {
        this.variantName = variantName;
    }
    public BigDecimal getPrice() {
        return price;
    }
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    public Integer getStockQuantity() {
        return stockQuantity;
    }
    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
}