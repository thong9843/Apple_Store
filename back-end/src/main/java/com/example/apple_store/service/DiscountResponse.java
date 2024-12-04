package com.example.apple_store.service;

import com.example.apple_store.entity.Discount;

public class DiscountResponse {
    private String message;
    private Discount discount;
    
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Discount getDiscount() {
        return discount;
    }

    public void setDiscount(Discount discount) {
        this.discount = discount;
    }

    public DiscountResponse(String message, Discount discount) {
        this.message = message;
        this.discount = discount;
    }
    
}