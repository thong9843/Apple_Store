package com.example.apple_store.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.apple_store.entity.Review;
import com.example.apple_store.service.ReviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    private final ReviewService reviewService;
    
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }
    
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }
    
    @PostMapping("/{productId}")
    public ResponseEntity<Review> addReview(
            @PathVariable Long productId,
            @Valid @RequestBody Review review) {
        
        review.setProductId(productId); 
        Review newReview = reviewService.addReview(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(newReview);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody Review reviewUpdate) {
        Review updatedReview = reviewService.updateReview(id, reviewUpdate);
        return ResponseEntity.ok(updatedReview);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> deleteAllReviewsByProduct(@PathVariable Long productId) {
        reviewService.deleteAllReviewsByProduct(productId);
        return ResponseEntity.noContent().build();
    }
}