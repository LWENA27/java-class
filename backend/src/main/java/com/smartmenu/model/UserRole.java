package com.smartmenu.model;

/**
 * User Roles Enum
 * 
 * TEACHING MOMENT:
 * Enum = fixed set of values (like constants)
 * Better than strings because typos cause compile errors
 * 
 * PHP equivalent:
 * class UserRole {
 *   const ADMIN = 'ADMIN';
 *   const RESTAURANT_OWNER = 'RESTAURANT_OWNER';
 * }
 */
public enum UserRole {
    ADMIN,              // System admin (can manage everything)
    RESTAURANT_OWNER,   // Restaurant owner (can manage their menu/orders)
    STAFF,              // Restaurant staff (limited access)
    CUSTOMER            // Customer (view menu, place orders)
}
