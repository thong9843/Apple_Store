package com.example.apple_store.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import com.example.apple_store.entity.Review;
import com.example.apple_store.exception.ResourceNotFoundException;
import com.example.apple_store.repository.ReviewRepository;

@Service
@Transactional
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    
    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId);
    }
    
    public Review addReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }
    
    public Review updateReview(Long id, Review reviewUpdate) {
        Review existingReview = reviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        
        existingReview.setRating(reviewUpdate.getRating());
        existingReview.setReview(reviewUpdate.getReview());
        
        return reviewRepository.save(existingReview);
    }
    
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }
    
    public void deleteAllReviewsByProduct(Long productId) {
        reviewRepository.deleteByProductId(productId);
    }
}