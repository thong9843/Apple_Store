package com.example.apple_store.controller;

public class ProductDiscountRequest {
    private Long productId;
    private Double discountAmount;
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public Double getDiscountAmount() {
        return discountAmount;
    }
    public void setDiscountAmount(Double discountAmount) {
        this.discountAmount = discountAmount;
    }
}