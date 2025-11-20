package com.smartmenu.controller;

import com.smartmenu.dto.LoginRequest;
import com.smartmenu.dto.LoginResponse;
import com.smartmenu.dto.MessageResponse;
import com.smartmenu.dto.RegisterRequest;
import com.smartmenu.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 🔐 AUTHENTICATION CONTROLLER
 * 
 * TEACHING MOMENT FOR BEGINNERS:
 * This is like the "reception desk" at a hotel. It handles:
 * 1. Registration (new guests checking in)
 * 2. Login (returning guests showing their ID)
 * 3. Getting your info (showing your room key)
 * 
 * ═══════════════════════════════════════════════════════════
 * PHP TO SPRING BOOT COMPARISON:
 * ═══════════════════════════════════════════════════════════
 * 
 * PHP:
 * ----
 * // auth.php
 * if ($_SERVER['REQUEST_METHOD'] == 'POST') {
 *   if ($_POST['action'] == 'login') {
 *     $username = $_POST['username'];
 *     $password = $_POST['password'];
 *     // Handle login...
 *   }
 * }
 * 
 * Spring Boot:
 * ------------
 * @PostMapping("/login")  ← Handles POST /api/auth/login
 * public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
 *   // Spring automatically converts JSON to LoginRequest object!
 * }
 * 
 * ═══════════════════════════════════════════════════════════
 * 
 * @RestController = This class handles HTTP requests and returns JSON
 * @RequestMapping("/api/auth") = All URLs in this class start with /api/auth
 * @RequiredArgsConstructor = Lombok generates constructor with AuthService
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    /**
     * TEACHING MOMENT:
     * This is dependency injection. Spring automatically creates AuthService
     * and "injects" it here when the controller is created.
     * 
     * PHP equivalent:
     * $authService = new AuthService($userRepo, $passwordEncoder);
     */
    private final AuthService authService;

    /**
     * 📝 REGISTER NEW USER
     * 
     * ENDPOINT: POST /api/auth/register
     * 
     * WHAT IT DOES:
     * Creates a new user account in the database
     * 
     * REQUEST BODY (JSON):
     * {
     *   "username": "john_doe",
     *   "email": "john@example.com",
     *   "password": "SecurePass123",
     *   "fullName": "John Doe"
     * }
     * 
     * RESPONSE (JSON):
     * {
     *   "message": "User registered successfully"
     * }
     * 
     * ERROR RESPONSE (if username already exists):
     * {
     *   "message": "Username is already taken"
     * }
     * 
     * TEACHING MOMENT:
     * @PostMapping = Handles HTTP POST requests (for creating data)
     * @Valid = Validates the request (checks @NotBlank, @Email, etc.)
     * @RequestBody = Convert JSON from request into RegisterRequest object
     * ResponseEntity = HTTP response with status code and body
     * 
     * PHP equivalent:
     * if ($_SERVER['REQUEST_METHOD'] == 'POST') {
     *   $data = json_decode(file_get_contents('php://input'));
     *   // validate $data
     *   // create user
     *   echo json_encode(['message' => 'Success']);
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        
        // Call service to register user
        String message = authService.register(request);
        
        // Wrap message in MessageResponse
        MessageResponse response = new MessageResponse(message);
        
        // Return HTTP 200 OK with success message
        return ResponseEntity.ok(response);
    }

    /**
     * 🔑 LOGIN USER
     * 
     * ENDPOINT: POST /api/auth/login
     * 
     * WHAT IT DOES:
     * 1. Checks if username and password are correct
     * 2. If correct, generates a JWT token (like a temporary VIP pass)
     * 3. Returns the token to the user
     * 4. User includes this token in future requests to prove they're logged in
     * 
     * REQUEST BODY (JSON):
     * {
     *   "username": "john_doe",
     *   "password": "SecurePass123"
     * }
     * 
     * SUCCESS RESPONSE (JSON):
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "type": "Bearer",
     *   "id": "507f1f77bcf86cd799439011",
     *   "username": "john_doe",
     *   "email": "john@example.com",
     *   "role": "CUSTOMER"
     * }
     * 
     * ERROR RESPONSE (if wrong password):
     * Status 401 Unauthorized
     * 
     * TEACHING MOMENT - HOW JWT LOGIN WORKS:
     * 
     * 1. Client sends username + password
     * 2. Server checks if they match (AuthService.login)
     * 3. Server creates JWT token with username inside
     * 4. Server sends token back to client
     * 5. Client stores token (localStorage, cookies, etc.)
     * 6. For future requests, client sends: "Authorization: Bearer <token>"
     * 7. Server validates token and knows who you are
     * 
     * Real-world analogy:
     * - Login = Going to concert venue, showing ID, getting wristband
     * - Token = The wristband
     * - Future requests = Showing wristband to enter VIP areas
     * 
     * PHP equivalent:
     * session_start();
     * if (password_verify($password, $hashedPassword)) {
     *   $_SESSION['user_id'] = $user['id'];
     *   echo json_encode(['message' => 'Login success']);
     * }
     * 
     * BUT PHP uses sessions (stored on server), JWT uses tokens (stored on client)
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        
        // Call service to authenticate and generate token
        LoginResponse response = authService.login(request);
        
        // Return HTTP 200 OK with token and user info
        return ResponseEntity.ok(response);
    }

    /**
     * 👤 GET CURRENT USER INFO
     * 
     * ENDPOINT: GET /api/auth/me
     * 
     * WHAT IT DOES:
     * Returns information about the currently logged-in user
     * 
     * REQUEST HEADERS:
     * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     * 
     * RESPONSE (JSON):
     * {
     *   "id": "507f1f77bcf86cd799439011",
     *   "username": "john_doe",
     *   "email": "john@example.com",
     *   "fullName": "John Doe",
     *   "role": "CUSTOMER"
     * }
     * 
     * TEACHING MOMENT:
     * This endpoint is PROTECTED - you MUST send a valid JWT token
     * 
     * How it works:
     * 1. Client sends request with "Authorization: Bearer <token>" header
     * 2. JwtAuthenticationFilter intercepts request
     * 3. Filter extracts and validates token
     * 4. Filter sets authentication in SecurityContext
     * 5. This method can now access the authenticated user
     * 
     * If token is missing or invalid → 401 Unauthorized
     * 
     * PHP session equivalent:
     * session_start();
     * if (!isset($_SESSION['user_id'])) {
     *   http_response_code(401);
     *   die('Unauthorized');
     * }
     * $user = getUserById($_SESSION['user_id']);
     * echo json_encode($user);
     * 
     * TODO: Implement this method to return current user info
     * (We'll do this after testing login)
     */
    @GetMapping("/me")
    public ResponseEntity<String> getCurrentUser() {
        return ResponseEntity.ok("Feature coming soon - will return current user info");
    }
}
