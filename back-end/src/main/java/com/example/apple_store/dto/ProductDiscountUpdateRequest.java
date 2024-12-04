package com.example.apple_store.dto;

import java.util.List;

import com.example.apple_store.entity.Discount;
import com.example.apple_store.entity.ProductDiscount;

public class ProductDiscountUpdateRequest {
    private Discount discount;
    private List<ProductDiscount> productDiscounts;
    
    public Discount getDiscount() {
        return discount;
    }
    
    public void setDiscount(Discount discount) {
        this.discount = discount;
    }
    
    public List<ProductDiscount> getProductDiscounts() {
        return productDiscounts;
    }
    
    public void setProductDiscounts(List<ProductDiscount> productDiscounts) {
        this.productDiscounts = productDiscounts;
    }
}