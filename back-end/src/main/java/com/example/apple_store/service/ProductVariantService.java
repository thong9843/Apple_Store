package com.example.apple_store.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apple_store.entity.Product;
import com.example.apple_store.entity.ProductVariant;
import com.example.apple_store.exception.ResourceNotFoundException;
import com.example.apple_store.repository.*;
import jakarta.transaction.Transactional;

@Service
public class ProductVariantService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    public List<ProductVariant> getAllProductVariants() {
        return productVariantRepository.findAll();
    }

    public List<ProductVariant> getProductVariantsByProductId(Long productId) {
        return productVariantRepository.findByProductId(productId);
    }

    public ProductVariant getProductVariantById(Long id) {
        return productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProductVariant not found"));
    }

@Transactional
    public ProductVariant addProductVariant(Long productId, ProductVariant productVariant) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        productVariant.setProduct(product);
        return productVariantRepository.save(productVariant);
    }

    public ProductVariant updateProductVariant(Long id, ProductVariant productVariantDetails) {
        ProductVariant productVariant = getProductVariantById(id);
        productVariant.setVariantName(productVariantDetails.getVariantName());
        productVariant.setPrice(productVariantDetails.getPrice());
        productVariant.setStockQuantity(productVariantDetails.getStockQuantity());
        productVariant.setIsAvailable(productVariantDetails.getIsAvailable());
        return productVariantRepository.save(productVariant);
    }

    public void deleteProductVariant(Long id) {
        productVariantRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllProductVariantsByProductId(Long productId) {
        productVariantRepository.deleteByProductId(productId);
    }
}
