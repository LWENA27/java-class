package com.smartmenu.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT Utility Class
 * 
 * This class handles everything about JWT tokens:
 * - Generate token (when user logs in)
 * - Validate token (check if it's real and not expired)
 * - Extract info from token (get username)
 * 
 * TEACHING MOMENT - How JWT Works:
 * 
 * 1. User logs in → We create a token with their username and expiration
 * 2. Sign it with a secret key (like a restaurant's stamp on a wristband)
 * 3. Send token to user
 * 4. User sends token back with every request
 * 5. We check signature and expiration → Is it valid?
 * 
 * PHP Equivalent:
 * This is like using Firebase/JWT library in PHP:
 * $token = JWT::encode($payload, $secret, 'HS256');
 * $decoded = JWT::decode($token, $secret, ['HS256']);
 */
@Component
public class JwtUtil {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    
    // Get secret key from application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    // Get expiration time from application.properties (default 24 hours)
    @Value("${jwt.expiration}")
    private long jwtExpirationMs;
    
    /**
     * Generate JWT token from username
     * 
     * This is called when user successfully logs in.
     * 
     * @param username - the user's username
     * @return JWT token as a string
     */
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        
        // Build the token (modern API)
        return Jwts.builder()
                .subject(username)              // Who is this token for?
                .issuedAt(now)                  // When was it created?
                .expiration(expiryDate)         // When does it expire?
                .signWith(key)                  // Sign with our secret
                .compact();                     // Create the string
    }
    
    /**
     * Extract username from JWT token
     * 
     * This is called for every request to see who is making the request.
     * 
     * @param token - JWT token string
     * @return username
     */
    public String getUsernameFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        
        return claims.getSubject();  // Subject = username
    }
    
    /**
     * Validate JWT token
     * 
     * Checks:
     * - Is signature correct? (not tampered with)
     * - Is it expired?
     * - Is format correct?
     * 
     * @param token - JWT token string
     * @return true if valid, false if not
     */
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            
            return true;  // If no exception, token is valid!
            
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token format: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        
        return false;  // If any exception, token is invalid
    }
}
