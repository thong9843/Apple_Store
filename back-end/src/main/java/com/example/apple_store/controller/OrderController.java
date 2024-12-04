package com.example.apple_store.controller;

import com.example.apple_store.dto.ApiResponse;
import com.example.apple_store.dto.OrderResponse;
import com.example.apple_store.dto.VNPayResponseDTO;
import com.example.apple_store.entity.Order;
import com.example.apple_store.entity.OrderStatus;
import com.example.apple_store.entity.PaymentConfirm;
import com.example.apple_store.entity.PaymentMethod;
import com.example.apple_store.service.OrderService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;
import com.example.apple_store.dto.OrderResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/from-cart-items")
    public ResponseEntity<OrderResponse> createOrderFromCartItems(
            @RequestParam Long userId,
            @RequestParam List<Long> cartItemIds,
            @RequestParam Long shippingAddressId,
            @RequestParam(required = false) String productDiscountCode,
            @RequestParam(required = false) String orderDiscountCode,
            @RequestParam PaymentMethod paymentMethod,
            HttpServletRequest request) throws UnsupportedEncodingException {

        Order order = orderService.createOrderFromCartItems(
                userId, cartItemIds, shippingAddressId,
                productDiscountCode, orderDiscountCode, paymentMethod);

        if (paymentMethod == PaymentMethod.VNPAY) {
            String paymentUrl = orderService.processVNPayPayment(order, request.getRemoteAddr());
            return ResponseEntity.ok(OrderResponse.fromOrderWithPayment(order, paymentUrl));
        }

        return ResponseEntity.ok(OrderResponse.fromOrder(order));
    }

    @PostMapping("/from-cart")
    public ResponseEntity<OrderResponse> createOrderFromCart(
            @RequestParam Long userId,
            @RequestParam Long cartId,
            @RequestParam Long shippingAddressId,
            @RequestParam(required = false) String productDiscountCode,
            @RequestParam(required = false) String orderDiscountCode,
            @RequestParam PaymentMethod paymentMethod,
            HttpServletRequest request) throws UnsupportedEncodingException {

        Order order = orderService.createOrderFromCart(
                userId, cartId, shippingAddressId,
                productDiscountCode, orderDiscountCode, paymentMethod);

        if (paymentMethod == PaymentMethod.VNPAY) {
            String paymentUrl = orderService.processVNPayPayment(order, request.getRemoteAddr());
            return ResponseEntity.ok(OrderResponse.fromOrderWithPayment(order, paymentUrl));
        }

        return ResponseEntity.ok(OrderResponse.fromOrder(order));
    }

    @PostMapping("/from-product")
    public ResponseEntity<OrderResponse> createOrderFromProduct(
            @RequestParam Long userId,
            @RequestParam Long productVariantId,
            @RequestParam Integer quantity,
            @RequestParam Long shippingAddressId,
            @RequestParam(required = false) String productDiscountCode,
            @RequestParam(required = false) String orderDiscountCode,
            @RequestParam PaymentMethod paymentMethod,
            HttpServletRequest request) throws UnsupportedEncodingException {

        Order order = orderService.createOrderFromProductVariant(
                userId, productVariantId, quantity, shippingAddressId,
                productDiscountCode, orderDiscountCode, paymentMethod);

        if (paymentMethod == PaymentMethod.VNPAY) {
            String paymentUrl = orderService.processVNPayPayment(order, request.getRemoteAddr());
            return ResponseEntity.ok(OrderResponse.fromOrderWithPayment(order, paymentUrl));
        }

        return ResponseEntity.ok(OrderResponse.fromOrder(order));
    }

    @GetMapping("/vnpay-callback")
    public ResponseEntity<VNPayResponseDTO> vnPayCallback(@RequestParam Map<String, String> params) {
        try {
            // Log tất cả parameters nhận được
            System.out.println("Received VNPay callback parameters: " + params);
            
            // Kiểm tra các tham số bắt buộc
            if (!params.containsKey("vnp_ResponseCode") || 
                !params.containsKey("vnp_TxnRef")) {
                System.out.println("Missing required parameters");
                throw new RuntimeException("Missing required parameters");
            }
    
            VNPayResponseDTO response = orderService.handleVNPayCallback(params);
            System.out.println("Successfully processed VNPay callback with response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error processing VNPay callback: " + e.getMessage());
            e.printStackTrace();
            // Tạo response thất bại với thông tin chi tiết hơn
            VNPayResponseDTO failureResponse = new VNPayResponseDTO();
            failureResponse.setResponseCode("99");
            failureResponse.setPaymentStatus("Giao dịch không thành công: " + e.getMessage());
            return ResponseEntity.ok(failureResponse); // Changed to ok() to ensure client gets the error details
        }
    }

    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderDetails(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderDetails(orderId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @PutMapping("/{orderId}/payment-status")
    public ResponseEntity<Order> updatePaymentConfirm(
            @PathVariable Long orderId,
            @RequestParam PaymentConfirm status) {
        return ResponseEntity.ok(orderService.updatePaymentConfirm(orderId, status));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok().build();
    }
}