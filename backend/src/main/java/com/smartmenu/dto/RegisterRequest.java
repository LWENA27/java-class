package com.smartmenu.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Register Request DTO
 * 
 * This is what a new user sends to create an account.
 * 
 * TEACHING MOMENT:
 * @Size = password must be 6-40 characters
 * @Email = must be valid email format
 * 
 * We NEVER store plain passwords! Always hash them.
 * Spring Security uses BCrypt (same as password_hash() in PHP)
 * 
 * Example JSON:
 * {
 *   "username": "john",
 *   "email": "john@example.com",
 *   "password": "mySecurePassword123",
 *   "restaurantName": "John's Pizza"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be 3-20 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be 6-40 characters")
    private String password;
    
    private String restaurantName; // Optional for restaurant owners
}
