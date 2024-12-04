package com.example.apple_store.service;

import com.example.apple_store.entity.Cart;
import com.example.apple_store.entity.CartItem;
import com.example.apple_store.repository.CartRepository;
import com.example.apple_store.repository.ProductVariantRepository;
import com.example.apple_store.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

        @Autowired
    private ProductVariantRepository productVariantRepository;

    @Transactional
    public Cart addToCart(Long userId, Long productVariantId, Integer quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductVariantId().equals(productVariantId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProductVariantId(productVariantId);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItem(Long userId, Long productVariantId, Integer quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductVariantId().equals(productVariantId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        item.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    @Transactional
    public void removeFromCart(Long userId, Long productVariantId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteByCartIdAndProductVariantId(cart.getId(), productVariantId);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public Cart getCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    @Transactional
    public void deleteCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cartRepository.delete(cart);
    }

    public double calculateCartTotal(Long userId) {
        Cart cart = getCart(userId);
        return cart.getItems().stream()
                .mapToDouble(item -> {
                    Double price = productVariantRepository.findPriceById(item.getProductVariantId());
                    return price * item.getQuantity();
                })
                .sum();
    }

}