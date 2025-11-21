package com.smartmenu.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Order Entity - Represents a customer order
 * Workflow: PENDING → CONFIRMED → PREPARING → READY → COMPLETED
 */
@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    private String id;
    
    // Reference to restaurant owner
    private String userId;
    
    // Which table placed this order
    private String tableId;
    private String tableNumber;
    
    // Customer information for tracking
    private String deviceId;        // Device that placed the order
    private String customerName;    // Optional customer name
    private String orderNumber;     // Human-readable order number (e.g., "ORD-001")
    
    // Order items
    private List<OrderItem> items = new ArrayList<>();
    
    // Order totals
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    
    // Order status
    private OrderStatus status = OrderStatus.PENDING;
    
    // Customer notes
    private String customerNotes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime completedAt;
    
    /**
     * Nested class for order items
     * (Embedded document - not a separate collection)
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private String menuItemId;
        private String menuItemName;
        private BigDecimal price;
        private Integer quantity;
        private String specialInstructions;  // e.g., "No onions"
    }
    
    /**
     * Order status enum
     */
    public enum OrderStatus {
        PENDING,      // Just placed, awaiting confirmation
        CONFIRMED,    // Restaurant confirmed the order
        PREPARING,    // Kitchen is preparing
        READY,        // Ready for pickup/serving
        COMPLETED,    // Delivered/served
        CANCELLED     // Order was cancelled
    }
}
