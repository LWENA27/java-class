package com.smartmenu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login Response DTO
 * 
 * This is what we send back after successful login.
 * 
 * TEACHING MOMENT:
 * The JWT token is the KEY to the kingdom!
 * Client must save this token (localStorage or cookie)
 * and send it with every request in the Authorization header:
 * 
 * Authorization: Bearer eyJhbGci0iJIUzI1...
 * 
 * Example response:
 * {
 *   "token": "eyJhbGci0iJIUzI1NiIsInR5cCI6...",
 *   "type": "Bearer",
 *   "username": "john",
 *   "email": "john@example.com",
 *   "role": "RESTAURANT_OWNER"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    
    private String token;           // The JWT token (this is the "wristband")
    private String type = "Bearer"; // Always "Bearer" for JWT
    private String id;              // User ID
    private String username;
    private String email;
    private String role;            // USER_ROLE enum as string
    
    // Constructor without type (defaults to "Bearer")
    public LoginResponse(String token, String id, String username, String email, String role) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}
