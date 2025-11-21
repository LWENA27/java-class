package com.smartmenu.repository;

import com.smartmenu.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MenuItem Repository
 */
@Repository
public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
    
    // Find all menu items for a specific restaurant/user
    List<MenuItem> findByUserId(String userId);
    
    // Find by category
    List<MenuItem> findByUserIdAndCategory(String userId, String category);
    
    // Find available items only
    List<MenuItem> findByUserIdAndAvailableTrue(String userId);
    
    // Find featured items
    List<MenuItem> findByUserIdAndFeaturedTrue(String userId);
    
    // Count methods for dashboard statistics
    long countByUserIdAndAvailableTrue(String userId);
}
