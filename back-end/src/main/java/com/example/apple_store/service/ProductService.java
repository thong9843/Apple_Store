package com.example.apple_store.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.apple_store.dto.ProductRequest;
import com.example.apple_store.entity.*;
import com.example.apple_store.repository.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;


@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private ProductImageRepository imageRepository;

    @Autowired
    private CategoryService categoryService;

    @Value("${app.upload.dir:${user.home}}")
    private String uploadDir;

    public List<Product> getProductsByCategory(Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return productRepository.findByCategory(category);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> searchProducts(String searchTerm) {
        return productRepository.searchProducts(searchTerm);
    }

    private String saveFile(MultipartFile file, String subDir) {
        if (file == null || file.isEmpty()) {
            return null; // Return null if the file is not provided
        }
    
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir, "static", "contents", subDir);
            Files.createDirectories(uploadPath);
    
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
    
            return "/contents/" + subDir + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file", e);
        }
    }


    @Transactional
    public Product createProduct(ProductRequest productRequest) {
        Category category = categoryService.getCategoryById(productRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
    
        String descriptionPath = saveFile(productRequest.getDescriptionFile(), "descriptions");
        String specificationPath = saveFile(productRequest.getSpecificationFile(), "specifications");
    
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(descriptionPath);
        product.setSpecification(specificationPath);
        product.setPrice(productRequest.getPrice());
        product.setCategory(category);
    
        return productRepository.save(product);
    }
    
    @Transactional
    public Product updateProduct(Long id, ProductRequest productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    
        if (productDetails.getDescriptionFile() != null && !productDetails.getDescriptionFile().isEmpty()) {
            String descriptionPath = saveFile(productDetails.getDescriptionFile(), "descriptions");
            product.setDescription(descriptionPath);
        }
    
        if (productDetails.getSpecificationFile() != null && !productDetails.getSpecificationFile().isEmpty()) {
            String specificationPath = saveFile(productDetails.getSpecificationFile(), "specifications");
            product.setSpecification(specificationPath);
        }
    
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
    
        Category category = categoryService.getCategoryById(productDetails.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
    
        return productRepository.save(product);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        variantRepository.deleteByProductId(id);
        imageRepository.deleteByProductId(id);

        productRepository.delete(product);
    }
}