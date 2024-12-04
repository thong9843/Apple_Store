package com.example.apple_store.dto;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

public class ProductRequest {
    private String name;
    private BigDecimal price;
    private MultipartFile descriptionFile;
    private MultipartFile specificationFile;

    public MultipartFile getDescriptionFile() {
        return descriptionFile;
    }
    public void setDescriptionFile(MultipartFile descriptionFile) {
        this.descriptionFile = descriptionFile;
    }
    public MultipartFile getSpecificationFile() {
        return specificationFile;
    }
    public void setSpecificationFile(MultipartFile specificationFile) {
        this.specificationFile = specificationFile;
    }
    private Long categoryId;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

}
