package com.smartmenu.service;

import com.smartmenu.dto.MenuItemRequest;
import com.smartmenu.dto.MenuItemResponse;
import com.smartmenu.model.MenuItem;
import com.smartmenu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * MenuItem Service - Business logic for menu items
 * 
 * @Service tells Spring this is a service layer component
 * @RequiredArgsConstructor (Lombok) creates constructor for final fields
 */
@Service
@RequiredArgsConstructor
public class MenuItemService {
    
    private final MenuItemRepository menuItemRepository;
    
    /**
     * Convert MenuItem model to MenuItemResponse DTO
     * This controls what data goes to the client
     */
    private MenuItemResponse toResponse(MenuItem item) {
        MenuItemResponse response = new MenuItemResponse();
        response.setId(item.getId());
        response.setUserId(item.getUserId());
        response.setName(item.getName());
        response.setDescription(item.getDescription());
        response.setPrice(item.getPrice());
        response.setCategory(item.getCategory());
        response.setImageUrl(item.getImageUrl());
        response.setAvailable(item.isAvailable());
        response.setAllergens(item.getAllergens());
        response.setPrepTimeMinutes(item.getPrepTimeMinutes());
        response.setFeatured(item.isFeatured());
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());
        return response;
    }
    
    /**
     * Convert MenuItemRequest DTO to MenuItem model
     * This creates model from client input
     */
    private MenuItem toModel(MenuItemRequest request) {
        MenuItem item = new MenuItem();
        item.setUserId(request.getUserId());
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        item.setAllergens(request.getAllergens());
        item.setPrepTimeMinutes(request.getPrepTimeMinutes());
        item.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        return item;
    }
    
    /**
     * Get all menu items (returns DTOs)
     */
    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }
    
    /**
     * Get all menu items for a specific user (returns DTOs)
     */
    public List<MenuItemResponse> getMenuItemsByUserId(String userId) {
        return menuItemRepository.findByUserId(userId).stream()
            .map(this::toResponse)
            .toList();
    }
    
    /**
     * Get available menu items only
     */
    public List<MenuItemResponse> getAvailableMenuItems(String userId) {
        return menuItemRepository.findByUserIdAndAvailableTrue(userId).stream()
            .map(this::toResponse)
            .toList();
    }
    
    /**
     * Get menu item by ID
     */
    public Optional<MenuItemResponse> getMenuItemById(String id) {
        return menuItemRepository.findById(id)
            .map(this::toResponse);
    }
    
    /**
     * Create new menu item from DTO
     */
    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        MenuItem item = toModel(request);
        MenuItem saved = menuItemRepository.save(item);
        return toResponse(saved);
    }
    
    /**
     * Update existing menu item
     */
    public MenuItemResponse updateMenuItem(String id, MenuItemRequest request) {
        // Check if exists
        MenuItem existing = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
        
        // Update fields
        existing.setUserId(request.getUserId());
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());
        existing.setCategory(request.getCategory());
        existing.setImageUrl(request.getImageUrl());
        existing.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        existing.setAllergens(request.getAllergens());
        existing.setPrepTimeMinutes(request.getPrepTimeMinutes());
        existing.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
        existing.setUpdatedAt(LocalDateTime.now());
        
        MenuItem updated = menuItemRepository.save(existing);
        return toResponse(updated);
    }
    
    /**
     * Toggle availability
     */
    public MenuItemResponse toggleAvailability(String id) {
        MenuItem item = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
        item.setAvailable(!item.isAvailable());
        item.setUpdatedAt(LocalDateTime.now());
        MenuItem updated = menuItemRepository.save(item);
        return toResponse(updated);
    }
    
    /**
     * Delete menu item
     */
    public void deleteMenuItem(String id) {
        if (!menuItemRepository.existsById(id)) {
            throw new RuntimeException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }
}
