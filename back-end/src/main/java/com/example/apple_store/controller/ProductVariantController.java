package com.example.apple_store.controller;

import com.example.apple_store.entity.ProductImage;
import com.example.apple_store.entity.ProductVariant;
import com.example.apple_store.service.ProductImageService;
import com.example.apple_store.service.ProductVariantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/product-variants")
public class ProductVariantController {

    private final ProductVariantService productVariantService;
    private final ProductImageService productImageService;

    public ProductVariantController(ProductVariantService productVariantService, ProductImageService productImageService) {
        this.productVariantService = productVariantService;
        this.productImageService = productImageService;
    }

    @GetMapping
    public List<ProductVariant> getAllProductVariants() {
        return productVariantService.getAllProductVariants();
    }

    @GetMapping("/product/{productId}")
    public List<ProductVariant> getProductVariantsByProductId(@PathVariable Long productId) {
        return productVariantService.getProductVariantsByProductId(productId);
    }

    @GetMapping("/{id}")
    public ProductVariant getProductVariantById(@PathVariable Long id) {
        return productVariantService.getProductVariantById(id);
    }

    @PostMapping("/product/{productId}/variant")
    public ResponseEntity<ProductVariant> addProductVariant(@PathVariable Long productId, @RequestBody ProductVariant productVariant) {
        ProductVariant savedVariant = productVariantService.addProductVariant(productId, productVariant);
        return new ResponseEntity<>(savedVariant, HttpStatus.CREATED);
    }

    @PostMapping("/product/{productId}/variant/{variantId}/image")
    public ResponseEntity<ProductImage> addProductVariantImage(@PathVariable Long productId, @PathVariable Long variantId, @RequestParam MultipartFile imageFile) {
        ProductImage savedImage = productImageService.addProductImage(variantId, imageFile);
        return new ResponseEntity<>(savedImage, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ProductVariant updateProductVariant(@PathVariable Long id, @RequestBody ProductVariant productVariantDetails) {
        return productVariantService.updateProductVariant(id, productVariantDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductVariant(@PathVariable Long id) {
        productVariantService.deleteProductVariant(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<?> deleteAllProductVariantsByProductId(@PathVariable Long productId) {
        productVariantService.deleteAllProductVariantsByProductId(productId);
        return ResponseEntity.ok().build();
    }
}
