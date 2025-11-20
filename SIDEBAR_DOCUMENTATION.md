# Sidebar Component Documentation

## Overview
The Sidebar component provides navigation for the admin dashboard with support for role-based access control.

## Location
- Component: `/frontend-react/src/components/Sidebar.jsx`
- Styles: `/frontend-react/src/components/Sidebar.css`

## Features

### 1. **Navigation Menu**
The sidebar includes navigation links to all main admin sections:
- Dashboard (statistics and overview)
- Manage Menu (add/edit menu items)
- Today's Menu (daily specials)
- Orders (view and process orders)
- Customer Feedback (view ratings and comments)
- Reports (sales analytics)
- QR Codes (generate table QR codes)
- Settings (system configuration - role-restricted)

### 2. **Notification Bell**
- Displays count of pending/new orders
- Click to navigate to Orders page
- Auto-refreshes every 30 seconds
- Animated badge when new orders exist

### 3. **Active Link Highlighting**
- Current page is highlighted with:
  - Blue background
  - Bold text
  - Green left border
  - Active ARIA attribute for accessibility

### 4. **User Profile Section**
Located at bottom of sidebar:
- User avatar icon
- Username display
- Role display (Administrator, Manager, etc.)

### 5. **Mobile Responsive**
- Hidden by default on mobile (≤768px)
- Toggle button in navbar to show/hide
- Smooth slide-in animation
- Overlay backdrop to close sidebar
- Auto-closes after clicking a link on mobile

## Role-Based Access Control (Future Implementation)

### Current State
Currently, all menu items are visible to all logged-in users. The component is designed to support role-based access control.

### Implementation Plan

#### Step 1: Update User Model
Add `features` array to User model in backend:
```java
@Document(collection = "users")
public class User {
    // ... existing fields
    private List<String> features; // e.g., ["dashboard", "menu", "orders", "reports"]
    private String role; // e.g., "ADMIN", "MANAGER", "STAFF"
}
```

#### Step 2: Backend API Endpoint
Create endpoint to return user's allowed features:
```java
@GetMapping("/api/users/features")
public ResponseEntity<Map<String, Object>> getUserFeatures() {
    User user = getCurrentUser();
    return ResponseEntity.ok(Map.of(
        "features", user.getFeatures(),
        "role", user.getRole()
    ));
}
```

#### Step 3: Frontend Implementation
Update `Sidebar.jsx` `hasFeatureAccess` function:
```javascript
const hasFeatureAccess = (feature) => {
    // Check if user has this feature enabled
    return user.features?.includes(feature) || user.role === 'ADMIN';
};
```

#### Step 4: Define Roles and Permissions

**Admin** (Full Access):
- All features enabled

**Manager**:
- Dashboard
- Menu Management
- Daily Menu
- Orders
- Reports
- QR Codes

**Staff**:
- Dashboard (view only)
- Orders
- Daily Menu

**Viewer**:
- Dashboard (view only)
- Reports

### Menu Item Configuration
Each menu item in `menuItems` array has:
- `path`: Route path
- `icon`: FontAwesome icon class
- `label`: Display text
- `feature`: Feature key for access control
- `requiresFeature`: Boolean (true = only show if user has feature)

Example:
```javascript
{
    path: '/settings',
    icon: 'fas fa-cog',
    label: 'Settings',
    feature: 'settings',
    requiresFeature: true // Only show if user has 'settings' feature
}
```

## Usage in Dashboard

```jsx
import Sidebar from '../components/Sidebar';

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="admin-container">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            
            <div className="main-wrapper">
                {/* Your content */}
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}
        </div>
    );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls sidebar visibility on mobile |
| `onToggle` | function | Yes | Callback to toggle sidebar open/close |

## Styling

### CSS Variables Used
- `--sidebar-width`: 250px (width of sidebar)
- Colors match main dashboard theme
- Z-index: 1001 (above main content, below modals)

### Key Classes
- `.sidebar`: Main sidebar container
- `.sidebar.active`: Sidebar visible on mobile
- `.sidebar-nav a.active`: Active/current page link
- `.notif-bell`: Notification bell icon
- `.notif-badge`: Notification count badge

## Accessibility Features
- Semantic HTML (`<nav>`, `<aside>`)
- ARIA labels for screen readers
- `aria-current="page"` on active links
- Keyboard navigation support
- Min touch target size: 48px
- Focus indicators on interactive elements

## Future Enhancements
1. **Real-time Notifications**: WebSocket connection for instant order updates
2. **Collapsible Sidebar**: Option to collapse to icon-only mode on desktop
3. **Favorites**: Allow users to pin frequently used pages
4. **Search**: Quick search to find menu items/orders
5. **Dark Mode**: Theme toggle in user profile section
6. **Breadcrumbs**: Show current location hierarchy
7. **Keyboard Shortcuts**: Quick access with keyboard (e.g., Ctrl+1 for Dashboard)

## Testing Checklist
- [ ] All navigation links work correctly
- [ ] Active link highlights on current page
- [ ] Notification badge appears with correct count
- [ ] Notification bell navigates to Orders page
- [ ] Mobile toggle button shows/hides sidebar
- [ ] Sidebar auto-closes after clicking link on mobile
- [ ] Overlay backdrop closes sidebar when clicked
- [ ] User profile displays correct username and role
- [ ] Logout button works correctly
- [ ] Responsive design works on all screen sizes
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces current page correctly

## Related Files
- `/frontend-react/src/pages/Dashboard.jsx` - Main dashboard using sidebar
- `/frontend-react/src/pages/Dashboard.css` - Dashboard layout with sidebar
- `/frontend-react/src/services/api.js` - API service for user data
- `/backend/src/main/java/com/smartmenu/model/User.java` - User model with roles

## Questions or Issues?
Contact the development team or refer to the main project documentation.
