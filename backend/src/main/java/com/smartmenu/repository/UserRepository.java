package com.smartmenu.repository;

import com.smartmenu.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User Repository - Database access for User entity
 * 
 * MongoRepository provides CRUD methods automatically:
 *  - save()
 *  - findById()
 *  - findAll()
 *  - deleteById()
 *  - etc.
 * 
 * You can also define custom query methods by following naming conventions
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    /**
     * Find user by username (for login)
     * Spring auto-implements this based on method name!
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Find user by email (alternative login method)
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if username already exists (for registration)
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if email already exists (for registration)
     */
    boolean existsByEmail(String email);
}
