package com.example.apple_store.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.example.apple_store.entity.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private Order order;
    private String paymentUrl;
}