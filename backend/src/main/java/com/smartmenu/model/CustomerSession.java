package com.smartmenu.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Customer Session Model
 * Tracks anonymous customers by device ID
 */
@Document(collection = "customer_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSession {
    
    @Id
    private String id;
    
    private String deviceId;        // Unique device identifier (generated on frontend)
    private String tableId;         // Current table being viewed
    private String userId;          // Restaurant owner ID
    private String customerName;    // Optional customer name
    private String customerPhone;   // Optional customer phone
    private Integer visitCount;     // How many times they've visited
    private LocalDateTime firstVisit;
    private LocalDateTime lastVisit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public CustomerSession(String deviceId, String tableId, String userId) {
        this.deviceId = deviceId;
        this.tableId = tableId;
        this.userId = userId;
        this.visitCount = 1;
        this.firstVisit = LocalDateTime.now();
        this.lastVisit = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
