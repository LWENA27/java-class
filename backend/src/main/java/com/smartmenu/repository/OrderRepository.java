package com.smartmenu.repository;

import com.smartmenu.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Order Repository
 */
@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    
    // Find all orders for a restaurant
    List<Order> findByUserId(String userId);
    
    // Find orders by status
    List<Order> findByUserIdAndStatus(String userId, Order.OrderStatus status);
    
    // Find orders for a specific table
    List<Order> findByTableId(String tableId);
    
    // Find orders by status, ordered by creation date
    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, Order.OrderStatus status);
}
