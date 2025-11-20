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
     * Find user by email (for login)
     * Spring auto-implements this based on method name!
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if email already exists (for registration)
     */
    boolean existsByEmail(String email);
}
