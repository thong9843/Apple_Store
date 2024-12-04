package com.example.apple_store.dto;

import com.example.apple_store.entity.Order;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Order order;
    private String paymentUrl;
    
    // Constructor for non-VNPAY orders
    public static OrderResponse fromOrder(Order order) {
        return new OrderResponse(order, null);
    }
    
    // Constructor for VNPAY orders
    public static OrderResponse fromOrderWithPayment(Order order, String paymentUrl) {
        return new OrderResponse(order, paymentUrl);
    }
}