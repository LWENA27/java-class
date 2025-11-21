package com.smartmenu.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Table Entity - Represents physical tables in the restaurant
 * Each table has a unique QR code that customers scan
 */
@Document(collection = "tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Table {
    
    @Id
    private String id;
    
    // Reference to restaurant owner
    private String userId;
    
    private String tableNumber;  // e.g., "Table 1", "Patio A", etc.
    
    // Unique identifier for the QR code
    private String qrCodeId;
    
    // URL that the QR code points to (e.g., https://smartmenu.com/menu/{qrCodeId})
    private String qrCodeUrl;
    
    // Base64 encoded QR code image (so we can display/download it)
    private String qrCodeImage;
    
    // Is this entry representing a room instead of a table?
    private boolean room = false;

    // Physical location or notes for the table/room (e.g., 'Main Hall')
    private String location;
    
    private boolean active = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
