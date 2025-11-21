package com.smartmenu.repository;

import com.smartmenu.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Feedback Repository
 * Handles database operations for customer feedback
 */
@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    
    // Find all feedback for a specific user with pagination
    Page<Feedback> findByUserId(String userId, Pageable pageable);
    
    // Find all feedback for a user
    List<Feedback> findByUserId(String userId);
    
    // Find feedback by rating
    Page<Feedback> findByUserIdAndRating(String userId, Integer rating, Pageable pageable);
    
    // Find feedback by order number
    Page<Feedback> findByUserIdAndOrderNumberContainingIgnoreCase(String userId, String orderNumber, Pageable pageable);
    
    // Find feedback within date range
    Page<Feedback> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    // Count total feedback for a user
    long countByUserId(String userId);
    
    // Get recent feedback (for dashboard)
    List<Feedback> findTop5ByUserIdOrderByCreatedAtDesc(String userId);
    
    // Calculate average rating
    List<Feedback> findByUserIdAndRatingGreaterThanEqual(String userId, Integer rating);
}
