package com.smartmenu.service;

import com.smartmenu.model.MenuItem;
import com.smartmenu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
     * Get all menu items for a restaurant/user
     */
    public List<MenuItem> getAllMenuItems(String userId) {
        return menuItemRepository.findByUserId(userId);
    }
    
    /**
     * Get available menu items only
     */
    public List<MenuItem> getAvailableMenuItems(String userId) {
        return menuItemRepository.findByUserIdAndAvailableTrue(userId);
    }
    
    /**
     * Get menu item by ID
     */
    public Optional<MenuItem> getMenuItemById(String id) {
        return menuItemRepository.findById(id);
    }
    
    /**
     * Create new menu item
     */
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }
    
    /**
     * Update existing menu item
     */
    public MenuItem updateMenuItem(String id, MenuItem menuItem) {
        menuItem.setId(id);
        return menuItemRepository.save(menuItem);
    }
    
    /**
     * Toggle availability
     */
    public MenuItem toggleAvailability(String id) {
        MenuItem item = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found"));
        item.setAvailable(!item.isAvailable());
        return menuItemRepository.save(item);
    }
    
    /**
     * Delete menu item
     */
    public void deleteMenuItem(String id) {
        menuItemRepository.deleteById(id);
    }
}
