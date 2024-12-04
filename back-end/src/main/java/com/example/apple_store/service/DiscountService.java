package com.example.apple_store.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.example.apple_store.controller.ProductDiscountRequest;
import com.example.apple_store.entity.*;
import com.example.apple_store.exception.ResourceNotFoundException;
import com.example.apple_store.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class DiscountService {
    private final DiscountRepository discountRepository;
    private final ProductDiscountRepository productDiscountRepository;
    private final ProductRepository productRepository;

    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    public List<Discount> getDiscountsByType(DiscountType type) {
        return discountRepository.findByDiscountType(type);
    }

    public List<Discount> getDiscountsByScope(DiscountScope scope) {
        return discountRepository.findByDiscountScope(scope);
    }

    public Discount createOrderDiscount(Discount discount) {
        if (discount.getDiscountScope() != DiscountScope.ORDER) {
            throw new IllegalArgumentException("Invalid discount scope. Must be ORDER");
        }
        return discountRepository.save(discount);
    }

    public Discount updateOrderDiscount(Long id, Discount discountDetails) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));

        if (discount.getDiscountScope() != DiscountScope.ORDER) {
            throw new IllegalArgumentException("Invalid discount scope. Must be ORDER");
        }

        discount.setDiscountCode(discountDetails.getDiscountCode());
        discount.setDescription(discountDetails.getDescription());
        discount.setDiscountType(discountDetails.getDiscountType());
        discount.setDiscountValue(discountDetails.getDiscountValue());
        discount.setStartDate(discountDetails.getStartDate());
        discount.setEndDate(discountDetails.getEndDate());
        discount.setMinOrderValue(discountDetails.getMinOrderValue());
        discount.setMaxDiscountAmount(discountDetails.getMaxDiscountAmount());
        discount.setUsageLimit(discountDetails.getUsageLimit());

        return discountRepository.save(discount);
    }

    public Discount createProductDiscount(Discount discount, List<ProductDiscount> productDiscounts) {
        if (discount.getDiscountScope() != DiscountScope.PRODUCT) {
            throw new IllegalArgumentException("Invalid discount scope. Must be PRODUCT");
        }

        discount = discountRepository.save(discount);
        return discount;
    }

    public List<ProductDiscount> getProductsInDiscount(Long discountId) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));

        return productDiscountRepository.findByDiscount(discount);
    }

    public void addProductsToDiscount(Long discountId, List<ProductDiscountRequest> productDiscountRequests) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));

        for (ProductDiscountRequest request : productDiscountRequests) {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            ProductDiscount productDiscount = new ProductDiscount();
            productDiscount.setDiscount(discount);
            productDiscount.setProduct(product);

            productDiscountRepository.save(productDiscount);
        }
    }

    public void updateProductInDiscount(Long discountId, Long productDiscountId, ProductDiscountRequest request) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));

        ProductDiscount productDiscount = productDiscountRepository.findById(productDiscountId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductDiscount not found"));

        if (!productDiscount.getDiscount().getId().equals(discountId)) {
            throw new IllegalArgumentException("ProductDiscount does not belong to the given discount");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        productDiscount.setProduct(product);

        productDiscountRepository.save(productDiscount);
    }

    public void deleteProductFromDiscount(Long discountId, Long productDiscountId) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));

        ProductDiscount productDiscount = productDiscountRepository.findById(productDiscountId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductDiscount not found"));

        if (!productDiscount.getDiscount().getId().equals(discountId)) {
            throw new IllegalArgumentException("ProductDiscount does not belong to the given discount");
        }

        productDiscountRepository.delete(productDiscount);
    }

    public Discount updateProductDiscount(Long id, Discount discountDetails, List<ProductDiscount> productDiscounts) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
    
        if (discount.getDiscountScope() != DiscountScope.PRODUCT) {
            throw new IllegalArgumentException("Invalid discount scope. Must be PRODUCT");
        }
    
        // Update discount details
        discount.setDiscountCode(discountDetails.getDiscountCode());
        discount.setDescription(discountDetails.getDescription());
        discount.setDiscountType(discountDetails.getDiscountType());
        discount.setDiscountValue(discountDetails.getDiscountValue());
        discount.setStartDate(discountDetails.getStartDate());
        discount.setEndDate(discountDetails.getEndDate());
        discount.setMinOrderValue(discountDetails.getMinOrderValue());
        discount.setMaxDiscountAmount(discountDetails.getMaxDiscountAmount());
        discount.setUsageLimit(discountDetails.getUsageLimit());
    
        return discountRepository.save(discount);
    }

    public void deleteDiscount(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));

        // ProductDiscount records will be automatically deleted due to CASCADE
        discountRepository.delete(discount);
    }

    public BigDecimal getDiscountValue(Discount discount) {
        if (discount == null) {
            throw new IllegalArgumentException("Discount cannot be null");
        }

        BigDecimal value = discount.getDiscountValue();
        if (value == null) {
            throw new IllegalArgumentException("Discount value cannot be null");
        }

        // For percentage discounts, ensure the value is between 0 and 100
        if (discount.getDiscountType() == DiscountType.PERCENTAGE) {
            if (value.compareTo(BigDecimal.ZERO) < 0 || value.compareTo(new BigDecimal("100")) > 0) {
                throw new IllegalArgumentException("Percentage discount must be between 0 and 100");
            }
        }
        // For fixed discounts, ensure the value is positive
        else if (discount.getDiscountType() == DiscountType.FIXED) {
            if (value.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Fixed discount value must be positive");
            }

            // If there's a maximum discount amount set, ensure we don't exceed it
            BigDecimal maxAmount = discount.getMaxDiscountAmount();
            if (maxAmount != null && value.compareTo(maxAmount) > 0) {
                return maxAmount;
            }
        }

        return value;
    }

    public ResponseEntity<?> checkDiscountAvailability(String discountCode) {
        Optional<Discount> discountOpt = discountRepository.findByDiscountCode(discountCode);
        
        if (!discountOpt.isPresent()) {
            return ResponseEntity.ok(new MessageResponse("Mã giảm giá không tồn tại"));
        }
        
        Discount discount = discountOpt.get();
        LocalDate now = LocalDate.now();
        
        // Kiểm tra thời gian hiệu lực
        if (now.isBefore(discount.getStartDate()) || now.isAfter(discount.getEndDate())) {
            return ResponseEntity.ok(new MessageResponse("Mã giảm giá đã hết hạn hoặc chưa đến thời gian sử dụng"));
        }
        
        // Kiểm tra giới hạn sử dụng
        if (discount.getUsageLimit() != null && discount.getUsageLimit() <= 0) {
            return ResponseEntity.ok(new MessageResponse("Mã giảm giá đã hết lượt sử dụng"));
        }
        
        return ResponseEntity.ok(new DiscountResponse("Mã giảm giá có thể sử dụng", discount));
    }

    public ResponseEntity<?> checkProductDiscountAvailability(String discountCode, Long productId) {
        Optional<Discount> discountOpt = discountRepository.findByDiscountCode(discountCode);
        
        if (!discountOpt.isPresent()) {
            return ResponseEntity.ok(new MessageResponse("Mã giảm giá không tồn tại"));
        }
        
        Discount discount = discountOpt.get();
        
        // Kiểm tra xem có phải là product discount không
        if (discount.getDiscountScope() != DiscountScope.PRODUCT) {
            return ResponseEntity.ok(new MessageResponse("Mã giảm giá không áp dụng cho sản phẩm"));
        }
        
        LocalDate now = LocalDate.now();
        
        // Kiểm tra thời gian hiệu lực
        if (now.isBefore(discount.getStartDate()) || now.isAfter(discount.getEndDate())) {
            return ResponseEntity.ok(new MessageResponse("Mã giảm giá đã hết hạn hoặc chưa đến thời gian sử dụng"));
        }
        
        // Kiểm tra giới hạn sử dụng
        if (discount.getUsageLimit() != null && discount.getUsageLimit() <= 0) {
            return ResponseEntity.ok(new MessageResponse("Mã giảm giá đã hết lượt sử dụng"));
        }
        
        // Kiểm tra sản phẩm có trong danh sách được giảm giá không
        List<ProductDiscount> productDiscounts = productDiscountRepository.findByDiscount(discount);
        boolean isProductEligible = productDiscounts.stream()
                .anyMatch(pd -> pd.getProduct().getId().equals(productId));
        
        if (!isProductEligible) {
            return ResponseEntity.ok(new MessageResponse("Sản phẩm này không áp dụng mã giảm giá"));
        }
        
        return ResponseEntity.ok(new DiscountResponse("Mã giảm giá có thể sử dụng cho sản phẩm này", discount));
    }


}