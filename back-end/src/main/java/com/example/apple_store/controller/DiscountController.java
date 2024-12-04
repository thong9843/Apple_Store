package com.example.apple_store.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.apple_store.dto.ProductDiscountUpdateRequest;
import com.example.apple_store.entity.Discount;
import com.example.apple_store.entity.DiscountScope;
import com.example.apple_store.entity.DiscountType;
import com.example.apple_store.entity.ProductDiscount;
import com.example.apple_store.service.DiscountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;

    @GetMapping
    public ResponseEntity<List<Discount>> getAllDiscounts() {
        List<Discount> discounts = discountService.getAllDiscounts();
        return ResponseEntity.ok(discounts);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Discount>> getDiscountsByType(@PathVariable String type) {
        DiscountType discountType = DiscountType.valueOf(type.toUpperCase());
        List<Discount> discounts = discountService.getDiscountsByType(discountType);
        return ResponseEntity.ok(discounts);
    }

    @GetMapping("/scope/{scope}")
    public ResponseEntity<List<Discount>> getDiscountsByScope(@PathVariable String scope) {
        DiscountScope discountScope = DiscountScope.valueOf(scope.toUpperCase());
        List<Discount> discounts = discountService.getDiscountsByScope(discountScope);
        return ResponseEntity.ok(discounts);
    }

    @PostMapping("/order")
    public ResponseEntity<Discount> createOrderDiscount(@RequestBody Discount discount) {
        Discount createdDiscount = discountService.createOrderDiscount(discount);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDiscount);
    }

    @PutMapping("/order/{id}")
    public ResponseEntity<Discount> updateOrderDiscount(@PathVariable Long id, @RequestBody Discount discountDetails) {
        Discount updatedDiscount = discountService.updateOrderDiscount(id, discountDetails);
        return ResponseEntity.ok(updatedDiscount);
    }

    @PostMapping("/product")
    public ResponseEntity<Discount> createProductDiscount(@RequestBody Discount discount) {
        Discount createdDiscount = discountService.createProductDiscount(discount, new ArrayList<>());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDiscount);
    }

    @GetMapping("/{discountId}/products")
    public ResponseEntity<List<ProductDiscount>> getProductsInDiscount(@PathVariable Long discountId) {
        List<ProductDiscount> productDiscounts = discountService.getProductsInDiscount(discountId);
        return ResponseEntity.ok(productDiscounts);
    }

    @PostMapping("/{discountId}/products")
    public ResponseEntity<Void> addProductsToDiscount(@PathVariable Long discountId,
            @RequestBody List<ProductDiscountRequest> productDiscountRequests) {
        discountService.addProductsToDiscount(discountId, productDiscountRequests);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{discountId}/products/{productDiscountId}")
    public ResponseEntity<Void> updateProductInDiscount(@PathVariable Long discountId,
            @PathVariable Long productDiscountId,
            @RequestBody ProductDiscountRequest request) {
        discountService.updateProductInDiscount(discountId, productDiscountId, request);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{discountId}/products/{productDiscountId}")
    public ResponseEntity<Void> deleteProductFromDiscount(@PathVariable Long discountId,
            @PathVariable Long productDiscountId) {
        discountService.deleteProductFromDiscount(discountId, productDiscountId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/product/{id}") 
    public ResponseEntity<Discount> updateProductDiscount(
        @PathVariable Long id,
        @RequestBody Discount discountDetails
    ) {
        Discount updatedDiscount = discountService.updateProductDiscount(id, discountDetails, null);
        return ResponseEntity.ok(updatedDiscount);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{discountCode}")
    public ResponseEntity<?> checkDiscountAvailability(@PathVariable String discountCode) {
        return discountService.checkDiscountAvailability(discountCode);
    }

    @GetMapping("/check/{discountCode}/product/{productId}")
    public ResponseEntity<?> checkProductDiscountAvailability(
            @PathVariable String discountCode,
            @PathVariable Long productId) {
        return discountService.checkProductDiscountAvailability(discountCode, productId);
    }
}