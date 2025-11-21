package com.smartmenu.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Feedback Model
 * Stores customer feedback for orders
 */
@Document(collection = "feedback")
public class Feedback {
    
    @Id
    private String id;
    
    private String userId;           // Restaurant owner ID
    private String orderId;          // Reference to order
    private String orderNumber;      // Order number for display
    private String tableNumber;      // Table/Room identifier
    private Double totalAmount;      // Order total
    private Integer rating;          // 1-5 stars
    private String comments;         // Customer feedback text
    private LocalDateTime createdAt; // Feedback submission time
    
    // Constructors
    public Feedback() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Feedback(String userId, String orderId, String orderNumber, String tableNumber, 
                   Double totalAmount, Integer rating, String comments) {
        this.userId = userId;
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.tableNumber = tableNumber;
        this.totalAmount = totalAmount;
        this.rating = rating;
        this.comments = comments;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getOrderId() {
        return orderId;
    }
    
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    
    public String getOrderNumber() {
        return orderNumber;
    }
    
    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
    
    public String getTableNumber() {
        return tableNumber;
    }
    
    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }
    
    public Double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
