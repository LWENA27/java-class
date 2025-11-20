package com.smartmenu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Simple message response
 * 
 * Used for success/error messages.
 * 
 * Example:
 * {
 *   "message": "User registered successfully!"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
}
