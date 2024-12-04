package com.example.apple_store.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@ConfigurationProperties(prefix = "vnpay")
@Data
@Validated
public class VNPayConfig {
    @NotBlank(message = "VNPAY TMN Code must not be blank")
    private String tmnCode;
    
    @NotBlank(message = "VNPAY Hash Secret must not be blank")
    private String hashSecret;
    
    private String version = "2.1.0";
    private String command = "pay";
    private String payUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private String returnUrl;
    private String apiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
    private String currCode = "VND";
    private String locale = "vn";

    @jakarta.annotation.PostConstruct
    public void init() {
        log.info("Initializing VNPAY configuration with TMN Code: {}", tmnCode);
        log.info("VNPAY return URL configured as: {}", returnUrl);
    }
}