package com.smartmenu.service;

import com.smartmenu.dto.LoginRequest;
import com.smartmenu.dto.LoginResponse;
import com.smartmenu.dto.RegisterRequest;
import com.smartmenu.model.User;
import com.smartmenu.model.UserRole;
import com.smartmenu.repository.UserRepository;
import com.smartmenu.security.UserDetailsImpl;
import com.smartmenu.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Authentication Service - Business logic for login/register
 * 
 * TEACHING MOMENT - What does this service do?
 * 
 * 1. REGISTER: Create new user account
 *    - Check if username/email already exists
 *    - Hash the password (NEVER store plain passwords!)
 *    - Save user to database
 * 
 * 2. LOGIN: Authenticate user and generate JWT token
 *    - Verify username and password
 *    - Generate JWT token
 *    - Return token to client
 * 
 * PHP Equivalent:
 * function register($data) {
 *   if (userExists($data['username'])) return error();
 *   $hashedPassword = password_hash($data['password']);
 *   $db->insert('users', ['username' => ..., 'password' => $hashedPassword]);
 * }
 * 
 * function login($data) {
 *   $user = $db->findByUsername($data['username']);
 *   if (!password_verify($data['password'], $user['password'])) return error();
 *   $token = generateJWT($user);
 *   return $token;
 * }
 */
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    
    /**
     * Register a new user
     * 
     * @param request - registration data (username, email, password)
     * @return success message
     * @throws RuntimeException if username or email already exists
     */
    public String register(RegisterRequest request) {
        // Check if username already taken
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        
        // Check if email already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        // Hash password (NEVER store plain text!)
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user.setRestaurantName(request.getRestaurantName());
        user.setRole(UserRole.RESTAURANT_OWNER);  // Default role
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        // Save to database
        userRepository.save(user);
        
        return "User registered successfully!";
    }
    
    /**
     * Login and generate JWT token
     * 
     * @param request - login credentials (username, password)
     * @return LoginResponse with JWT token and user details
     */
    public LoginResponse login(LoginRequest request) {
        // Step 1: Authenticate user (verify username + password)
        // This throws exception if credentials are wrong
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        
        // Step 2: Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Step 3: Generate JWT token
        String jwt = jwtUtil.generateToken(request.getUsername());
        
        // Step 4: Get user details
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Step 5: Build response
        return new LoginResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getAuthorities().iterator().next().getAuthority()
        );
    }
}
