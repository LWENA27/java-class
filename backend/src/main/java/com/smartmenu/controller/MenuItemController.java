package com.smartmenu.controller;

import com.smartmenu.model.MenuItem;
import com.smartmenu.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * MenuItem REST Controller
 * 
 * @RestController = @Controller + @ResponseBody (returns JSON automatically)
 * @RequestMapping defines base URL path
 * @CrossOrigin allows React frontend to call these APIs
 */
@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class MenuItemController {
    
    private final MenuItemService menuItemService;
    
    /**
     * GET /api/menu-items?userId=123
     * Get all menu items for a user
     */
    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems(
            @RequestParam String userId) {
        List<MenuItem> items = menuItemService.getAllMenuItems(userId);
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/menu-items/available?userId=123
     * Get only available items
     */
    @GetMapping("/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuItems(
            @RequestParam String userId) {
        List<MenuItem> items = menuItemService.getAvailableMenuItems(userId);
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/menu-items/{id}
     * Get single menu item
     */
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable String id) {
        return menuItemService.getMenuItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * POST /api/menu-items
     * Create new menu item
     */
    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(
            @RequestBody MenuItem menuItem) {
        MenuItem created = menuItemService.createMenuItem(menuItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * PUT /api/menu-items/{id}
     * Update menu item
     */
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable String id,
            @RequestBody MenuItem menuItem) {
        MenuItem updated = menuItemService.updateMenuItem(id, menuItem);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * PATCH /api/menu-items/{id}/toggle-availability
     * Toggle available/unavailable
     */
    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<MenuItem> toggleAvailability(@PathVariable String id) {
        MenuItem updated = menuItemService.toggleAvailability(id);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * DELETE /api/menu-items/{id}
     * Delete menu item
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable String id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
