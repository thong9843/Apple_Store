package com.example.apple_store.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.example.apple_store.exception.*;
import com.example.apple_store.entity.ProductImage;
import com.example.apple_store.entity.ProductVariant;
import com.example.apple_store.repository.*;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProductImageService {
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;

    @Value("${app.upload.dir:${user.home}}")
    private String uploadDir;

    private String saveFile(MultipartFile file, String subDir) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir, "static", "contents", "image", "product");
            Files.createDirectories(uploadPath);
        
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
        
            return "/contents/image/product/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store the file", e);
        }
        
    }

    public List<ProductImage> getAllProductImages(Long productId) {
        return productImageRepository.findByProductId(productId);
    }

    public List<ProductImage> getAllVariantImages(Long variantId) {
        return productImageRepository.findByVariantId(variantId);
    }

    public ProductImage getProductImage(Long imageId) {
        return productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage not found"));
    }

    public ProductImage addProductImage(Long variantId, MultipartFile imageFile) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant not found"));

        String imageUrl = saveFile(imageFile, "product");
        ProductImage newImage = new ProductImage();
        newImage.setVariant(variant);
        newImage.setProduct(variant.getProduct());
        newImage.setImageUrl(imageUrl);

        return productImageRepository.save(newImage);
    }

    public ProductImage updateProductImage(Long imageId, MultipartFile imageFile) {
        ProductImage existingImage = getProductImage(imageId);
        String imageUrl = saveFile(imageFile, "product");
        existingImage.setImageUrl(imageUrl);
        return productImageRepository.save(existingImage);
    }

    public void deleteProductImage(Long imageId) {
        productImageRepository.deleteById(imageId);
    }

    public void deleteAllVariantImages(Long variantId) {
        List<ProductImage> variantImages = getAllVariantImages(variantId);
        productImageRepository.deleteAll(variantImages);
    }

    public void deleteAllProductImages(Long productId) {
        List<ProductImage> productImages = getAllProductImages(productId);
        productImageRepository.deleteAll(productImages);
    }
}
