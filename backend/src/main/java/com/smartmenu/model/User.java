package com.smartmenu.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * User Entity - Represents restaurant owners/managers who use the system
 * 
 * @Document tells Spring this is a MongoDB collection
 * @Data (Lombok) generates getters/setters/toString/equals/hashCode
 * @NoArgsConstructor creates empty constructor
 * @AllArgsConstructor creates constructor with all fields
 */
@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    private String id;  // MongoDB uses String IDs by default
    
    @Indexed(unique = true)  // Create unique index on email
    private String email;
    
    private String password;  // Will be hashed with BCrypt
    
    private String firstName;
    
    private String lastName;
    
    private String restaurantName;
    
    private String phone;
    
    // User roles (ADMIN, MANAGER, STAFF)
    private Set<String> roles = new HashSet<>();
    
    private boolean active = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
