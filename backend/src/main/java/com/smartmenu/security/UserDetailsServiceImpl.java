package com.smartmenu.security;

import com.smartmenu.model.User;
import com.smartmenu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * UserDetailsService Implementation
 * 
 * This tells Spring Security HOW to load a user from the database.
 * 
 * TEACHING MOMENT - What is UserDetailsService?
 * 
 * When someone tries to log in:
 * 1. Spring Security calls: loadUserByUsername("john")
 * 2. We fetch user from MongoDB
 * 3. We convert User → UserDetailsImpl
 * 4. Spring Security compares passwords
 * 
 * PHP Equivalent:
 * function getUserByUsername($username) {
 *   $user = $db->query("SELECT * FROM users WHERE username = ?", [$username]);
 *   return $user;
 * }
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    /**
     * Load user by username
     * 
     * Spring Security calls this automatically during login.
     * 
     * @param username - the username to search for
     * @return UserDetails object (wrapped User)
     * @throws UsernameNotFoundException if user not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find user in database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with username: " + username
                ));
        
        // Convert User → UserDetailsImpl
        return UserDetailsImpl.build(user);
    }
}
