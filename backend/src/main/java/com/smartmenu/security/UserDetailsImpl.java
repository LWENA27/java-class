package com.smartmenu.security;

import com.smartmenu.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * UserDetails Implementation
 * 
 * This wraps our User model for Spring Security.
 * 
 * TEACHING MOMENT - Why do we need this?
 * 
 * Spring Security doesn't know about OUR User model.
 * It only knows about UserDetails interface.
 * So we wrap our User in UserDetails.
 * 
 * Think of it like an adapter/translator:
 * - Spring Security asks: "What's the username?"
 * - UserDetailsImpl answers: user.getUsername()
 * 
 * PHP Equivalent:
 * This is like creating a session wrapper in PHP:
 * class SessionUser {
 *   public function __construct($user) { $this->user = $user; }
 *   public function getUsername() { return $this->user['username']; }
 * }
 */
@Data
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {
    
    private String id;
    private String username;
    private String email;
    private String password;  // Hashed password
    private Collection<? extends GrantedAuthority> authorities;  // Roles/permissions
    
    /**
     * Build UserDetails from our User model
     * 
     * This converts: User → UserDetailsImpl
     */
    public static UserDetailsImpl build(User user) {
        // Convert role enum to Spring Security authority
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
        
        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
    
    // ========== UserDetails Interface Methods ==========
    // Spring Security calls these methods
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;  // User's roles (e.g., ROLE_ADMIN)
    }
    
    @Override
    public String getPassword() {
        return password;  // Hashed password
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;  // Our accounts don't expire
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;  // We don't lock accounts (could add this feature later)
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // Passwords don't expire
    }
    
    @Override
    public boolean isEnabled() {
        return true;  // All accounts are enabled (could add email verification later)
    }
}
