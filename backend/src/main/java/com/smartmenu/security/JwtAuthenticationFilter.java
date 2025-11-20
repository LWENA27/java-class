package com.smartmenu.security;

import com.smartmenu.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * 
 * This is the SECURITY GUARD at the door of your restaurant.
 * 
 * TEACHING MOMENT - How this works:
 * 
 * For EVERY request to the API:
 * 1. Extract JWT token from Authorization header
 * 2. Validate the token (is it real? not expired?)
 * 3. Get username from token
 * 4. Load user details from database
 * 5. Tell Spring Security "this user is authenticated!"
 * 
 * If any step fails → Request is UNAUTHORIZED (401)
 * 
 * PHP Equivalent:
 * // At the top of every protected PHP page:
 * $token = $_SERVER['HTTP_AUTHORIZATION'];
 * if (!validateToken($token)) {
 *   http_response_code(401);
 *   die('Unauthorized');
 * }
 * $user = getUserFromToken($token);
 * $_SESSION['user'] = $user;
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    
    /**
     * This runs for EVERY request
     * 
     * It checks if the request has a valid JWT token.
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        try {
            // Step 1: Get JWT token from request header
            String jwt = parseJwt(request);
            
            // Step 2: If token exists and is valid
            if (jwt != null && jwtUtil.validateToken(jwt)) {
                
                // Step 3: Get username from token
                String username = jwtUtil.getUsernameFromToken(jwt);
                
                // Step 4: Load user details from database
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // Step 5: Create authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,  // credentials (we don't need password here)
                                userDetails.getAuthorities()  // roles
                        );
                
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                // Step 6: Tell Spring Security this user is authenticated!
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                logger.debug("Set authentication for user: {}", username);
            }
            
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }
        
        // Continue the filter chain (let request proceed)
        filterChain.doFilter(request, response);
    }
    
    /**
     * Extract JWT token from Authorization header
     * 
     * Expected header format:
     * Authorization: Bearer eyJhbGci0iJIUzI1NiIsInR5cCI6...
     * 
     * @param request - HTTP request
     * @return JWT token string (without "Bearer " prefix)
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        
        // Check if header exists and starts with "Bearer "
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            // Remove "Bearer " prefix and return token
            return headerAuth.substring(7);
        }
        
        return null;
    }
}
