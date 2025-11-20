package com.smartmenu.config;

import com.smartmenu.security.JwtAuthenticationFilter;
import com.smartmenu.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security Configuration - JWT Authentication
 * 
 * TEACHING MOMENT - What does this do?
 * 
 * This is the SECURITY BLUEPRINT for your entire API.
 * It defines:
 * 1. Which endpoints are public (no login needed)
 * 2. Which endpoints require authentication
 * 3. How to check if user is authenticated (JWT filter)
 * 4. How to store passwords (BCrypt hashing)
 * 
 * PHP Equivalent:
 * This is like having a security middleware in PHP:
 * - Public routes: /login, /register
 * - Protected routes: everything else
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Allows @PreAuthorize annotations
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    /**
     * Configure HTTP security
     * 
     * This defines which URLs are public and which need authentication.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (not needed for stateless JWT APIs)
            .csrf(csrf -> csrf.disable())
            
            // Disable sessions (JWT is stateless)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configure which endpoints need authentication
            .authorizeHttpRequests(auth -> auth
                // Public endpoints (no authentication needed)
                .requestMatchers("/api/auth/**").permitAll()    // Login, register
                .requestMatchers("/api/health").permitAll()      // Health check
                .requestMatchers("/swagger-ui/**").permitAll()   // API docs
                .requestMatchers("/api-docs/**").permitAll()     // API docs
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            );
        
        // Add JWT filter BEFORE Spring Security's username/password filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    /**
     * Password encoder bean
     * 
     * BCrypt is a secure hashing algorithm for passwords.
     * Same as password_hash() and password_verify() in PHP.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * Authentication provider
     * 
     * Tells Spring Security:
     * - Use our UserDetailsService to load users
     * - Use BCrypt to compare passwords
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    /**
     * Authentication manager
     * 
     * This is what actually performs the authentication check.
     * Used in AuthController when user logs in.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) 
            throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
