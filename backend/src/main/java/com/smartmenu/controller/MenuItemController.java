package com.smartmenu.controller;

import com.smartmenu.dto.MenuItemRequest;
import com.smartmenu.dto.MenuItemResponse;
import com.smartmenu.service.MenuItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * MenuItem REST Controller - The gateway between HTTP and your business logic
 * 
 * @RestController = @Controller + @ResponseBody (returns JSON automatically)
 * @RequestMapping defines base URL path for all methods
 * @CrossOrigin allows React frontend to call these APIs (CORS)
 * @RequiredArgsConstructor (Lombok) = constructor injection for final fields
 * 
 * TEACHING MOMENT:
 * This is like PHP routes.php + controller combined.
 * Each method = one HTTP endpoint.
 * Spring Boot handles all the JSON conversion for you!
 */
@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class MenuItemController {
    
    private final MenuItemService menuItemService;
    
    /**
     * GET /api/menu-items
     * Get ALL menu items (all users, all restaurants)
     * 
     * Use this for admin dashboard or testing
     */
    @GetMapping
    public ResponseEntity<List<MenuItemResponse>> getAllMenuItems() {
        List<MenuItemResponse> items = menuItemService.getAllMenuItems();
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/menu-items/user/{userId}
     * Get all menu items for a specific user/restaurant
     * 
     * Example: GET /api/menu-items/user/user123
     * 
     * @PathVariable extracts {userId} from URL
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MenuItemResponse>> getMenuItemsByUser(
            @PathVariable String userId) {
        List<MenuItemResponse> items = menuItemService.getMenuItemsByUserId(userId);
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/menu-items/user/{userId}/available
     * Get only AVAILABLE menu items for a user
     * 
     * Use this for customer-facing menu (QR code scan)
     */
    @GetMapping("/user/{userId}/available")
    public ResponseEntity<List<MenuItemResponse>> getAvailableMenuItems(
            @PathVariable String userId) {
        List<MenuItemResponse> items = menuItemService.getAvailableMenuItems(userId);
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/menu-items/{id}
     * Get a single menu item by ID
     * 
     * @return 200 OK with item, or 404 Not Found
     * 
     * TEACHING MOMENT:
     * Optional<> is Java's way to handle "might not exist"
     * .map(ResponseEntity::ok) = if present, return 200
     * .orElse(...) = if not present, return 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<MenuItemResponse> getMenuItemById(@PathVariable String id) {
        return menuItemService.getMenuItemById(id)
            .map(ResponseEntity::ok)                    // Found: return 200 OK
            .orElse(ResponseEntity.notFound().build()); // Not found: return 404
    }
    
    /**
     * POST /api/menu-items
     * Create a new menu item
     * 
     * Request body example (JSON):
     * {
     *   "userId": "user123",
     *   "name": "Margherita Pizza",
     *   "description": "Classic Italian pizza",
     *   "price": 12.99,
     *   "category": "Pizza",
     *   "imageUrl": "http://example.com/pizza.jpg",
     *   "available": true
     * }
     * 
     * @RequestBody = Parse JSON → MenuItemRequest object
     * @Valid = Run validation (@NotBlank, @Positive, etc.)
     * 
     * Returns: 201 Created with the created item
     */
    @PostMapping
    public ResponseEntity<MenuItemResponse> createMenuItem(
            @Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse created = menuItemService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * PUT /api/menu-items/{id}
     * Update an existing menu item (full replacement)
     * 
     * PUT = replace entire resource
     * Must send all fields (even unchanged ones)
     * 
     * Returns: 200 OK with updated item, or 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable String id,
            @Valid @RequestBody MenuItemRequest request) {
        try {
            MenuItemResponse updated = menuItemService.updateMenuItem(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * PATCH /api/menu-items/{id}/toggle
     * Toggle availability: available → unavailable (or vice versa)
     * 
     * PATCH = partial update (just one field)
     * No request body needed!
     * 
     * Use case: Restaurant runs out of an item, mark unavailable
     * 
     * Example: PATCH /api/menu-items/673e1a2b4c5d6e7f8a9b0c1d/toggle
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<MenuItemResponse> toggleAvailability(@PathVariable String id) {
        try {
            MenuItemResponse updated = menuItemService.toggleAvailability(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * DELETE /api/menu-items/{id}
     * Delete a menu item
     * 
     * Returns: 204 No Content (success), or 404 if not found
     * 
     * TEACHING MOMENT:
     * HTTP 204 = "Success, but I have nothing to send back"
     * ResponseEntity<Void> = no response body
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable String id) {
        try {
            menuItemService.deleteMenuItem(id);
            return ResponseEntity.noContent().build();  // HTTP 204
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();  // HTTP 404
        }
    }
}
