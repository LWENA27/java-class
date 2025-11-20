package com.smartmenu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login Request DTO
 * 
 * This is what the user sends when they want to log in.
 * 
 * TEACHING MOMENT:
 * In PHP, you'd get this from $_POST['username'] and $_POST['password']
 * In Spring Boot, @RequestBody converts JSON to this object automatically.
 * 
 * Example JSON:
 * {
 *   "username": "john",
 *   "password": "mypassword123"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Password is required")
    private String password;
}
