package com.smartmenu.controller;

import com.smartmenu.model.Feedback;
import com.smartmenu.repository.FeedbackRepository;
import com.smartmenu.repository.MenuItemRepository;
import com.smartmenu.repository.OrderRepository;
import com.smartmenu.repository.TableRepository;
import com.smartmenu.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Dashboard Controller - Provides statistics and summary data
 * 
 * TEACHING MOMENT:
 * This endpoint aggregates data from multiple collections to provide
 * a summary view for the admin dashboard.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final TableRepository tableRepository;
    private final FeedbackRepository feedbackRepository;

    /**
     * GET /api/dashboard/stats
     * Returns dashboard statistics for the authenticated user
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @AuthenticationPrincipal UserDetailsImpl currentUser
    ) {
        String userId = currentUser.getId();
        
        Map<String, Object> stats = new HashMap<>();
        
        // Count total orders for this user
        long totalOrders = orderRepository.countByUserId(userId);
        
        // Count pending orders
        long pendingOrders = orderRepository.countByUserIdAndStatus(userId, "pending");
        
        // Count active menu items
        long activeItems = menuItemRepository.countByUserIdAndAvailableTrue(userId);
        
        // Count tables/rooms
        long tablesCount = tableRepository.countByUserId(userId);
        
        // Calculate today's sales (simplified - would need date filtering in real app)
        // For now, we'll return 0 and you can implement proper date-based aggregation
        double totalSales = 0.0;
        
        stats.put("totalOrders", totalOrders);
        stats.put("totalSales", totalSales);
        stats.put("pendingOrders", pendingOrders);
        stats.put("activeItems", activeItems);
        stats.put("tablesCount", tablesCount);
        
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/dashboard/recent-orders
     * Returns recent orders (limit 10)
     */
    @GetMapping("/recent-orders")
    public ResponseEntity<List<Map<String, Object>>> getRecentOrders(
            @AuthenticationPrincipal UserDetailsImpl currentUser
    ) {
        String userId = currentUser.getId();
        
        // Get recent orders - simplified version
        // In production, you'd want to add pagination and proper sorting
        var orders = orderRepository.findByUserId(userId);
        
        List<Map<String, Object>> recentOrders = new ArrayList<>();
        
        // Take first 10 orders (you can add proper sorting by date)
        int count = Math.min(orders.size(), 10);
        for (int i = 0; i < count; i++) {
            var order = orders.get(i);
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("id", order.getId());
            orderData.put("orderNumber", "ORD-" + order.getId().substring(Math.max(0, order.getId().length() - 3)));
            orderData.put("tableNumber", order.getTableNumber());
            orderData.put("amount", order.getTotal());
            orderData.put("status", order.getStatus());
            orderData.put("createdAt", order.getCreatedAt());
            recentOrders.add(orderData);
        }
        
        return ResponseEntity.ok(recentOrders);
    }

    /**
     * GET /api/dashboard/top-items
     * Returns top selling menu items
     */
    @GetMapping("/top-items")
    public ResponseEntity<List<Map<String, Object>>> getTopItems(
            @AuthenticationPrincipal UserDetailsImpl currentUser
    ) {
        String userId = currentUser.getId();
        
        // Get all menu items for this user
        var menuItems = menuItemRepository.findByUserId(userId);
        
        List<Map<String, Object>> topItems = new ArrayList<>();
        
        // Take first 5 items (in production, calculate actual sales from orders)
        int count = Math.min(menuItems.size(), 5);
        for (int i = 0; i < count; i++) {
            var item = menuItems.get(i);
            Map<String, Object> itemData = new HashMap<>();
            itemData.put("name", item.getName());
            itemData.put("totalSold", 0); // Would calculate from order items
            itemData.put("totalRevenue", 0.0); // Would calculate from order items
            topItems.add(itemData);
        }
        
        return ResponseEntity.ok(topItems);
    }

    /**
     * GET /api/dashboard/recent-feedback
     * Returns recent customer feedback (limit 5)
     */
    @GetMapping("/recent-feedback")
    public ResponseEntity<List<Map<String, Object>>> getRecentFeedback(
            @AuthenticationPrincipal UserDetailsImpl currentUser
    ) {
        String userId = currentUser.getId();
        
        // Get recent 5 feedback entries
        List<Feedback> feedbackList = feedbackRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);
        
        List<Map<String, Object>> recentFeedback = new ArrayList<>();
        
        for (Feedback feedback : feedbackList) {
            Map<String, Object> feedbackData = new HashMap<>();
            feedbackData.put("id", feedback.getId());
            feedbackData.put("orderNumber", feedback.getOrderNumber());
            feedbackData.put("tableNumber", feedback.getTableNumber());
            feedbackData.put("rating", feedback.getRating());
            feedbackData.put("comments", feedback.getComments());
            feedbackData.put("totalAmount", feedback.getTotalAmount());
            feedbackData.put("createdAt", feedback.getCreatedAt());
            recentFeedback.add(feedbackData);
        }
        
        return ResponseEntity.ok(recentFeedback);
    }
}
