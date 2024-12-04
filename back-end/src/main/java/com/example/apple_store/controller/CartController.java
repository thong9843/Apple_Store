package com.example.apple_store.controller;

import com.example.apple_store.entity.Cart;
import com.example.apple_store.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestParam Long userId,
            @RequestParam Long productVariantId,
            @RequestParam Integer quantity) {
        Cart updatedCart = cartService.addToCart(userId, productVariantId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/update")
    public ResponseEntity<Cart> updateCartItem(@RequestParam Long userId,
            @RequestParam Long productVariantId,
            @RequestParam Integer quantity) {
        Cart updatedCart = cartService.updateCartItem(userId, productVariantId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(@RequestParam Long userId,
            @RequestParam Long productVariantId) {
        cartService.removeFromCart(userId, productVariantId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteCart(@PathVariable Long userId) {
        cartService.deleteCart(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        Cart cart = cartService.getCart(userId);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/{userId}/total")
    public ResponseEntity<Double> getCartTotal(@PathVariable Long userId) {
        double total = cartService.calculateCartTotal(userId);
        return ResponseEntity.ok(total);
    }
}