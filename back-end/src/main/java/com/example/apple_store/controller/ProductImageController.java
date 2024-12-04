package com.example.apple_store.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.apple_store.entity.ProductImage;
import com.example.apple_store.service.ProductImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/product-images")
@RequiredArgsConstructor
public class ProductImageController {
    private final ProductImageService productImageService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImage>> getAllProductImages(@PathVariable Long productId) {
        return ResponseEntity.ok(productImageService.getAllProductImages(productId));
    }

    @GetMapping("/variant/{variantId}")
    public ResponseEntity<List<ProductImage>> getAllVariantImages(@PathVariable Long variantId) {
        return ResponseEntity.ok(productImageService.getAllVariantImages(variantId));
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<ProductImage> getProductImage(@PathVariable Long imageId) {
        return ResponseEntity.ok(productImageService.getProductImage(imageId));
    }

    @PostMapping("/variant/{variantId}/image")
    public ResponseEntity<ProductImage> addProductImage(
            @PathVariable Long variantId,
            @RequestParam MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be null or empty");
        }
        ProductImage savedImage = productImageService.addProductImage(variantId, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedImage);
    }

    @PutMapping("/{imageId}")
    public ResponseEntity<ProductImage> updateProductImage(
            @PathVariable Long imageId,
            @RequestParam MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be null or empty");
        }
        ProductImage updatedImage = productImageService.updateProductImage(imageId, imageFile);
        return ResponseEntity.ok(updatedImage);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Long imageId) {
        productImageService.deleteProductImage(imageId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/variant/{variantId}")
    public ResponseEntity<Void> deleteAllVariantImages(@PathVariable Long variantId) {
        productImageService.deleteAllVariantImages(variantId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> deleteAllProductImages(@PathVariable Long productId) {
        productImageService.deleteAllProductImages(productId);
        return ResponseEntity.noContent().build();
    }
}