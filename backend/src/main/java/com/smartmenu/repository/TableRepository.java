package com.smartmenu.repository;

import com.smartmenu.model.Table;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Table Repository
 */
@Repository
public interface TableRepository extends MongoRepository<Table, String> {

    // Find all tables for a specific user (tenant/owner)
    List<Table> findByUserId(String userId);

    // Optional: find by user and table number (for uniqueness checks)
    List<Table> findByUserIdAndTableNumber(String userId, String tableNumber);

    // Find table by QR code ID (when customer scans)
    Optional<Table> findByQrCodeId(String qrCodeId);

    // Find active tables
    List<Table> findByUserIdAndActiveTrue(String userId);
}
