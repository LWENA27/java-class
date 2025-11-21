package com.smartmenu.controller;

import com.smartmenu.model.CustomerSession;
import com.smartmenu.model.MenuItem;
import com.smartmenu.model.Table;
import com.smartmenu.repository.CustomerSessionRepository;
import com.smartmenu.repository.MenuItemRepository;
import com.smartmenu.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Public Menu Controller - No authentication required
 * Allows customers to view menu without logging in
 */
@RestController
@RequestMapping("/api/public")
public class PublicMenuController {
    
    @Autowired
    private TableRepository tableRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private CustomerSessionRepository customerSessionRepository;
    
    /**
     * GET /api/public/table/{tableId}
     * Get table information (for customer view)
     */
    @GetMapping("/table/{tableId}")
    public ResponseEntity<?> getTableInfo(@PathVariable String tableId) {
        Optional<Table> tableOpt = tableRepository.findById(tableId);
        
        if (!tableOpt.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Table not found");
            return ResponseEntity.notFound().build();
        }
        
        Table table = tableOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", table.getId());
        response.put("tableNumber", table.getTableNumber());
        response.put("userId", table.getUserId());
        response.put("qrCodeId", table.getQrCodeId());
        response.put("qrCodeUrl", table.getQrCodeUrl());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/public/menu/{tableId}
     * Get menu items for a specific table's restaurant
     */
    @GetMapping("/menu/{tableId}")
    public ResponseEntity<?> getMenuForTable(
            @PathVariable String tableId,
            @RequestParam(required = false) String deviceId
    ) {
        // Get table to find the userId (tenant)
        Optional<Table> tableOpt = tableRepository.findById(tableId);
        
        if (!tableOpt.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Table not found");
            return ResponseEntity.badRequest().body(error);
        }
        
        Table table = tableOpt.get();
        String userId = table.getUserId();
        
        // Track customer session if deviceId provided
        if (deviceId != null && !deviceId.isEmpty()) {
            trackCustomerSession(deviceId, tableId, userId);
        }
        
        // Get all available menu items for this restaurant
        List<MenuItem> menuItems = menuItemRepository.findByUserIdAndAvailableTrue(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("tableId", tableId);
        response.put("tableNumber", table.getTableNumber());
        response.put("menuItems", menuItems);
        response.put("totalItems", menuItems.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/public/session
     * Track or update customer session
     */
    @PostMapping("/session")
    public ResponseEntity<?> trackSession(@RequestBody Map<String, String> sessionData) {
        String deviceId = sessionData.get("deviceId");
        String tableId = sessionData.get("tableId");
        String customerName = sessionData.get("customerName");
        String customerPhone = sessionData.get("customerPhone");
        
        if (deviceId == null || tableId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "deviceId and tableId are required");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Get table to find userId
        Optional<Table> tableOpt = tableRepository.findById(tableId);
        if (!tableOpt.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Table not found");
            return ResponseEntity.badRequest().body(error);
        }
        
        String userId = tableOpt.get().getUserId();
        
        // Find or create session
        Optional<CustomerSession> existingSession = customerSessionRepository.findByDeviceId(deviceId);
        CustomerSession session;
        
        if (existingSession.isPresent()) {
            session = existingSession.get();
            session.setVisitCount(session.getVisitCount() + 1);
            session.setLastVisit(LocalDateTime.now());
            session.setTableId(tableId);
            session.setUpdatedAt(LocalDateTime.now());
            
            if (customerName != null) session.setCustomerName(customerName);
            if (customerPhone != null) session.setCustomerPhone(customerPhone);
        } else {
            session = new CustomerSession(deviceId, tableId, userId);
            if (customerName != null) session.setCustomerName(customerName);
            if (customerPhone != null) session.setCustomerPhone(customerPhone);
        }
        
        session = customerSessionRepository.save(session);
        
        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.getId());
        response.put("visitCount", session.getVisitCount());
        response.put("isReturningCustomer", session.getVisitCount() > 1);
        response.put("customerName", session.getCustomerName());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/public/session/{deviceId}
     * Get customer session info
     */
    @GetMapping("/session/{deviceId}")
    public ResponseEntity<?> getSession(@PathVariable String deviceId) {
        Optional<CustomerSession> sessionOpt = customerSessionRepository.findByDeviceId(deviceId);
        
        if (!sessionOpt.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No session found");
            response.put("isReturningCustomer", "false");
            return ResponseEntity.ok(response);
        }
        
        CustomerSession session = sessionOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.getId());
        response.put("visitCount", session.getVisitCount());
        response.put("isReturningCustomer", session.getVisitCount() > 1);
        response.put("customerName", session.getCustomerName());
        response.put("lastVisit", session.getLastVisit());
        
        return ResponseEntity.ok(response);
    }
    
    // Helper method to track customer session
    private void trackCustomerSession(String deviceId, String tableId, String userId) {
        Optional<CustomerSession> existingSession = customerSessionRepository.findByDeviceId(deviceId);
        
        if (existingSession.isPresent()) {
            CustomerSession session = existingSession.get();
            session.setVisitCount(session.getVisitCount() + 1);
            session.setLastVisit(LocalDateTime.now());
            session.setTableId(tableId);
            session.setUpdatedAt(LocalDateTime.now());
            customerSessionRepository.save(session);
        } else {
            CustomerSession newSession = new CustomerSession(deviceId, tableId, userId);
            customerSessionRepository.save(newSession);
        }
    }
}
