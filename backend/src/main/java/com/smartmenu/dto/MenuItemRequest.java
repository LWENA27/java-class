package com.smartmenu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for creating/updating menu items
 * 
 * Why separate from MenuItem model?
 * - API contract is different from database model
 * - Validation only on input
 * - Hide internal fields (like timestamps)
 * - Client doesn't send _id, createdAt, updatedAt
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequest {
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;  // Use BigDecimal for money!
    
    private String category;
    
    private String imageUrl;
    
    private Boolean available = true; // Default to available
    
    private List<String> allergens;
    
    private Integer prepTimeMinutes;
    
    private Boolean featured = false;
}
