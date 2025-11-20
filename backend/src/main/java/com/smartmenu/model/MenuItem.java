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
 * MenuItem Entity - Represents food/drink items on the menu
 * This is the core product in the system
 */
@Document(collection = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {
    
    @Id
    private String id;
    
    // Reference to restaurant owner
    private String userId;
    
    private String name;
    
    private String description;
    
    private BigDecimal price;  // Use BigDecimal for money (never use float/double!)
    
    private String category;  // e.g., "Appetizer", "Main Course", "Dessert", "Drinks"
    
    private String imageUrl;  // URL to uploaded image
    
    private boolean available = true;  // Can be toggled on/off
    
    // Allergen warnings
    private List<String> allergens = new ArrayList<>();  // e.g., ["nuts", "dairy", "gluten"]
    
    // Preparation time in minutes
    private Integer prepTimeMinutes;
    
    // Is this a special/featured item?
    private boolean featured = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
