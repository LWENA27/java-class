package com.smartmenu.controller;

import com.smartmenu.model.Order;
import com.smartmenu.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * OrderController - Manage restaurant orders
 * Endpoints for restaurant staff to view and update orders
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * GET /api/orders
     * Get all orders for the authenticated restaurant owner
     */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(Authentication authentication) {
        String username = authentication.getName();
        
        // In a real app, get userId from the authenticated user
        // For now, we'll get all orders
        List<Order> orders = orderRepository.findAll();
        
        return ResponseEntity.ok(orders);
    }

    /**
     * GET /api/orders/{id}
     * Get a specific order by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id, Authentication authentication) {
        Optional<Order> order = orderRepository.findById(id);
        
        if (order.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(order.get());
    }

    /**
     * PUT /api/orders/{id}
     * Update order status
     */
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(
            @PathVariable String id,
            @RequestBody UpdateOrderRequest request,
            Authentication authentication) {
        
        Optional<Order> orderOpt = orderRepository.findById(id);
        
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Order order = orderOpt.get();
        
        // Update status if provided
        if (request.getStatus() != null) {
            try {
                Order.OrderStatus status = Order.OrderStatus.valueOf(request.getStatus());
                order.setStatus(status);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        // Save updated order
        Order savedOrder = orderRepository.save(order);
        
        return ResponseEntity.ok(savedOrder);
    }

    /**
     * DELETE /api/orders/{id}
     * Delete an order (cancel)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id, Authentication authentication) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Request DTO for updating orders
     */
    public static class UpdateOrderRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
