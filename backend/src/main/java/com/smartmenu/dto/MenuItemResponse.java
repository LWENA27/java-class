package com.smartmenu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for menu item responses
 * 
 * Why separate response DTO?
 * - Control exactly what client receives
 * - Can add computed fields (like "isNew")
 * - Can format dates/numbers
 * - Hide sensitive data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponse {
    
    private String id;
    private String userId;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private boolean available;
    private List<String> allergens;
    private Integer prepTimeMinutes;
    private boolean featured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Could add computed fields like:
    // private Boolean isNew; // created in last 7 days
    // private String formattedPrice; // "$12.99"
}
