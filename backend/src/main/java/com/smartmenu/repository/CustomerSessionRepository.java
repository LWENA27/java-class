package com.smartmenu.repository;

import com.smartmenu.model.CustomerSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Customer Session Repository
 */
@Repository
public interface CustomerSessionRepository extends MongoRepository<CustomerSession, String> {
    
    // Find session by device ID
    Optional<CustomerSession> findByDeviceId(String deviceId);
    
    // Find session by device ID and table ID
    Optional<CustomerSession> findByDeviceIdAndTableId(String deviceId, String tableId);
}
