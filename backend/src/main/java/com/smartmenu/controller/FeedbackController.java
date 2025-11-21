package com.smartmenu.controller;

import com.smartmenu.model.Feedback;
import com.smartmenu.repository.FeedbackRepository;
import com.smartmenu.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Feedback Controller
 * Handles customer feedback endpoints
 */
@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    /**
     * Get all feedback with filtering and pagination
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllFeedback(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String orderNumber,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "date_desc") String sortBy
    ) {
        String userId = userDetails.getId();
        
        // Determine sort order
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("date_asc".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "createdAt");
        } else if ("rating_desc".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "rating").and(Sort.by(Sort.Direction.DESC, "createdAt"));
        } else if ("rating_asc".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "rating").and(Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Feedback> feedbackPage;
        
        // Apply filters
        if (rating != null && rating > 0) {
            feedbackPage = feedbackRepository.findByUserIdAndRating(userId, rating, pageable);
        } else if (orderNumber != null && !orderNumber.isEmpty()) {
            feedbackPage = feedbackRepository.findByUserIdAndOrderNumberContainingIgnoreCase(userId, orderNumber, pageable);
        } else if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
            feedbackPage = feedbackRepository.findByUserIdAndCreatedAtBetween(userId, start, end, pageable);
        } else {
            feedbackPage = feedbackRepository.findByUserId(userId, pageable);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("entries", feedbackPage.getContent());
        response.put("currentPage", feedbackPage.getNumber());
        response.put("totalPages", feedbackPage.getTotalPages());
        response.put("totalItems", feedbackPage.getTotalElements());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get feedback by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id
    ) {
        String userId = userDetails.getId();
        return feedbackRepository.findById(id)
                .filter(feedback -> feedback.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Create new feedback
     */
    @PostMapping
    public ResponseEntity<Feedback> createFeedback(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Feedback feedback
    ) {
        String userId = userDetails.getId();
        feedback.setUserId(userId);
        feedback.setCreatedAt(LocalDateTime.now());
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return ResponseEntity.ok(savedFeedback);
    }
    
    /**
     * Get feedback statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getFeedbackStats(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String userId = userDetails.getId();
        List<Feedback> allFeedback = feedbackRepository.findByUserId(userId);
        
        long totalFeedback = allFeedback.size();
        double averageRating = allFeedback.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);
        
        // Count by rating
        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int rating = i;
            long count = allFeedback.stream()
                    .filter(f -> f.getRating() == rating)
                    .count();
            ratingDistribution.put(rating, count);
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFeedback", totalFeedback);
        stats.put("averageRating", Math.round(averageRating * 10.0) / 10.0);
        stats.put("ratingDistribution", ratingDistribution);
        
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Delete feedback
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFeedback(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id
    ) {
        String userId = userDetails.getId();
        return feedbackRepository.findById(id)
                .filter(feedback -> feedback.getUserId().equals(userId))
                .map(feedback -> {
                    feedbackRepository.delete(feedback);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Feedback deleted successfully");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
