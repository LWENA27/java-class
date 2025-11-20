# 🎨 Visual Components Guide

## Dashboard Layout

```
┌────────────────────────────────────────────────────────────────┐
│                     SIDEBAR (250px wide)                       │
│ ┌────────────────┐                                            │
│ │  Smart Menu    │  ═══════════════════════════════════════  │
│ │   🔔 (5) ☰    │         Navbar                             │
│ ├────────────────┤  ☰ Smart Menu    Welcome, Admin | Logout  │
│ │                │  ═══════════════════════════════════════  │
│ │ 📊 Dashboard   │                                            │
│ │ 🍴 Manage Menu │        Dashboard Header                    │
│ │ 📅 Today's Menu│  ───────────────────────────────────────  │
│ │ 🛒 Orders      │                                            │
│ │ 💬 Feedback    │   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │
│ │ 📊 Reports     │   │ 🛒  │  │ 💰  │  │ 📋  │  │ 🍴  │    │
│ │ 🔲 QR Codes    │   │ 45  │  │1.25M│  │  8  │  │ 32  │    │
│ │ ⚙️  Settings   │   │Order│  │Sales│  │Pend │  │Items│    │
│ │                │   └─────┘  └─────┘  └─────┘  └─────┘    │
│ │                │                  ┌─────┐                  │
│ │ 🚪 Logout      │                  │ 🪑  │                  │
│ │                │                  │ 15  │                  │
│ ├────────────────┤                  │Table│                  │
│ │   👤 Admin     │                  └─────┘                  │
│ │ Administrator  │  ───────────────────────────────────────  │
│ └────────────────┘                                            │
│                    ┌──────────────────────────────────────┐  │
│                    │      Recent Orders                   │  │
│                    ├──────────────────────────────────────┤  │
│                    │ Order# | Table | Amount | Status |   │  │
│                    │ ORD-001| Tbl 5 | 45,000 |🟢Deliver│  │  │
│                    │ ORD-002| Rm 2  | 78,000 |🟠Prepare│  │  │
│                    │ ORD-003| Tbl 1 | 32,000 |🔵Confirm│  │  │
│                    └──────────────────────────────────────┘  │
│                                                               │
│    ┌─────────────────┐  ┌──────────────────────────────┐   │
│    │ Top Selling     │  │   Customer Feedback          │   │
│    ├─────────────────┤  ├──────────────────────────────┤   │
│    │ Ugali & Fish    │  │ ORD-001 | Tbl 5 | ⭐⭐⭐⭐⭐ │   │
│    │ 45 sold, 675K   │  │ "Excellent service!"         │   │
│    │                 │  │                              │   │
│    │ Pilau & Chicken │  │ ORD-004 | Tbl 3 | ⭐⭐⭐⭐☆ │   │
│    │ 38 sold, 570K   │  │ "Good food, fast delivery"   │   │
│    └─────────────────┘  └──────────────────────────────┘   │
│                                                               │
│                    ┌──────────────────────────────────────┐  │
│                    │       Quick Actions                  │  │
│                    ├──────────────────────────────────────┤  │
│                    │  [🍴 Manage] [📅 Today] [🛒 Orders] │  │
│                    │  [🔲 QR Codes]                      │  │
│                    └──────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Color Coding

### Stat Cards:
- **Today's Orders** (🛒): Red gradient (#ff4757 → #ff6b81)
- **Today's Sales** (💰): Green gradient (#10ac84 → #00b894)
- **Pending Orders** (📋): Orange gradient (#ff9f43 → #ffb142)
- **Active Menu Items** (🍴): Purple gradient (#5f27cd → #6c5ce7)
- **Tables/Rooms** (🪑): Pink gradient (#ee5a6f → #ff6b81)

### Status Badges:
- **🟢 Delivered**: Green background (#d1e7dd), dark green text (#0f5132)
- **🟠 Preparing**: Yellow background (#fff3cd), dark yellow text (#856404)
- **🔵 Confirmed**: Blue background (#cfe2ff), dark blue text (#084298)
- **🟠 Pending**: Yellow background (#fff3cd), dark yellow text (#856404)
- **🔴 Cancelled**: Red background (#f8d7da), dark red text (#842029)

### Quick Action Buttons:
1. **Manage Menu**: Red (#ff4757)
2. **Today's Menu**: Green (#10ac84)
3. **Process Orders**: Orange (#ff9f43)
4. **QR Codes**: Purple (#5f27cd)

## Mobile View (≤768px)

```
┌─────────────────────────┐
│ ☰ Smart Menu | Logout  │  ← Navbar
├─────────────────────────┤
│                         │
│  Dashboard              │
│                         │
│  ┌───────────────────┐ │
│  │ 🛒 Today's Orders │ │
│  │       45          │ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │ 💰 Today's Sales  │ │
│  │   1,250,000 TSH   │ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │ 📋 Pending Orders │ │
│  │        8          │ │
│  └───────────────────┘ │
│                         │
│  ... (stats continue)   │
│                         │
│  ┌─────────────────────┐│
│  │  Recent Orders      ││
│  │  (scroll →)         ││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│
│  │  Top Selling Items  ││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│
│  │  Quick Actions      ││
│  │  [Manage Menu]      ││
│  │  [Today's Menu]     ││
│  │  [Process Orders]   ││
│  │  [QR Codes]         ││
│  └─────────────────────┘│
└─────────────────────────┘

Click ☰ to show sidebar:

┌────────────────┐┌────────┐
│  Smart Menu    ││        │
│  🔔 (5)   ☰   ││  Dark  │
├────────────────┤│ Overlay│
│                ││        │
│ 📊 Dashboard   ││        │
│ 🍴 Manage Menu ││        │
│ 📅 Today's Menu││        │
│ 🛒 Orders      ││        │
│ 💬 Feedback    ││        │
│ 📊 Reports     ││        │
│ 🔲 QR Codes    ││        │
│ ⚙️  Settings   ││        │
│ 🚪 Logout      ││        │
│                ││        │
│   👤 Admin     ││        │
│ Administrator  ││        │
└────────────────┘└────────┘
   Sidebar slides     Click to
   in from left       close
```

## Component Hierarchy

```
Dashboard
├── Sidebar
│   ├── Sidebar Header
│   │   ├── Site Name ("Smart Menu")
│   │   ├── Notification Bell (🔔 with badge)
│   │   └── Toggle Button (☰)
│   ├── Navigation Menu
│   │   ├── Dashboard Link (active highlight)
│   │   ├── Manage Menu Link
│   │   ├── Today's Menu Link
│   │   ├── Orders Link
│   │   ├── Feedback Link
│   │   ├── Reports Link
│   │   ├── QR Codes Link
│   │   ├── Settings Link (role-restricted)
│   │   └── Logout Link
│   └── User Profile Footer
│       ├── Avatar Icon
│       ├── Username
│       └── Role
│
├── Main Wrapper
│   ├── Navbar
│   │   ├── Mobile Menu Button (☰)
│   │   ├── Brand Logo
│   │   ├── User Welcome
│   │   └── Logout Button
│   │
│   └── Main Content
│       ├── Header ("Dashboard")
│       │
│       ├── Stats Container (5 cards in grid)
│       │   ├── Stat Card 1 (Today's Orders)
│       │   ├── Stat Card 2 (Today's Sales)
│       │   ├── Stat Card 3 (Pending Orders)
│       │   ├── Stat Card 4 (Active Items)
│       │   └── Stat Card 5 (Tables/Rooms)
│       │
│       ├── Dashboard Grid (3 cards in grid)
│       │   ├── Recent Orders Card
│       │   │   ├── Card Header (title + "View All" link)
│       │   │   └── Data Table (6 columns)
│       │   │
│       │   ├── Top Selling Items Card
│       │   │   ├── Card Header (title + "View Reports" link)
│       │   │   └── Data Table (3 columns)
│       │   │
│       │   └── Customer Feedback Card
│       │       ├── Card Header (title + "View All" link)
│       │       └── Data Table (4 columns with star ratings)
│       │
│       └── Quick Actions Section
│           ├── Section Header ("Quick Actions")
│           └── Action Buttons Grid (4 buttons)
│               ├── Manage Menu Button (red)
│               ├── Today's Menu Button (green)
│               ├── Process Orders Button (orange)
│               └── QR Codes Button (purple)
│
└── Sidebar Overlay (mobile only, dark backdrop)
```

## Interactive Elements

### Hover Effects:
- **Stat Cards**: Lift up 5px, shadow increases
- **Navigation Links**: Light white background (10% opacity)
- **Quick Action Buttons**: Lift up 3px, shadow appears
- **Data Table Rows**: Light gray background
- **Logout Button**: Darker red background

### Click Actions:
- **Sidebar Links**: Navigate to page, close sidebar (mobile)
- **Notification Bell**: Navigate to Orders page
- **Mobile Menu Button**: Toggle sidebar open/close
- **Sidebar Overlay**: Close sidebar
- **Quick Action Buttons**: Navigate to respective pages
- **"View All" Links**: Navigate to full list pages
- **Logout Button**: Clear session, redirect to login

### Animations:
- **Sidebar Toggle**: 0.3s slide in/out (mobile)
- **Card Hover**: 0.3s transform and shadow
- **Button Hover**: 0.3s background color and transform
- **Notification Badge**: 2s infinite pulse animation
- **Loading Spinner**: Continuous rotation

## Accessibility Features

### Keyboard Navigation:
- Tab through all interactive elements
- Enter to activate buttons/links
- Arrow keys for table navigation
- Escape to close sidebar (mobile)

### Screen Reader Support:
- ARIA labels on buttons ("Toggle sidebar", "New orders")
- `aria-current="page"` on active navigation link
- Semantic HTML (`<nav>`, `<main>`, `<aside>`, `<table>`)
- Alt text for icons (using `aria-hidden="true"` on decorative icons)

### Touch Targets:
- Minimum 48px × 48px for all clickable elements
- Sufficient spacing between interactive elements
- Large tap targets on mobile

### Color Contrast:
- All text meets WCAG AA standards
- Status badges have sufficient contrast
- Focus indicators visible on all elements

## Data Flow

```
User Loads Dashboard
         ↓
   useEffect Hook
         ↓
   Check Authentication
         ↓
   Load User Data (localStorage)
         ↓
   Load Dashboard Data
         ↓
   ┌─────────────────────┐
   │  API Calls          │
   │  (currently mock)   │
   ├─────────────────────┤
   │ • getStats()        │
   │ • getRecentOrders() │
   │ • getTopItems()     │
   │ • getFeedback()     │
   └─────────────────────┘
         ↓
   Update State (useState)
         ↓
   Re-render Components
         ↓
   Display Data to User

Sidebar (separate flow):
   Load on Mount
         ↓
   Get User Data
         ↓
   Load Pending Orders Count
         ↓
   Set Interval (30s refresh)
         ↓
   Display Notification Badge
```

## Files Structure

```
smart-menu-saas/
├── frontend-react/
│   └── src/
│       ├── components/
│       │   ├── Sidebar.jsx       ← Navigation component
│       │   ├── Sidebar.css       ← Sidebar styles
│       │   └── index.js          ← Component exports
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx     ← Main dashboard page
│       │   └── Dashboard.css     ← Dashboard styles
│       │
│       └── services/
│           └── api.js            ← API service (JWT, localStorage)
│
├── DASHBOARD_SIDEBAR_SUMMARY.md  ← Complete summary
├── SIDEBAR_DOCUMENTATION.md      ← Sidebar docs
└── RUNNING_GUIDE.md              ← How to run app
```

## What You See vs What You Code

### What You See:
- Beautiful admin dashboard with stats and charts
- Professional sidebar navigation
- Colorful cards with icons
- Data tables with status badges
- Quick action buttons

### What Powers It:
1. **React Components** - Reusable UI pieces
2. **React Hooks** - State management (useState, useEffect)
3. **React Router** - Navigation (useNavigate, useLocation)
4. **CSS Grid & Flexbox** - Responsive layouts
5. **LocalStorage** - User session persistence
6. **Axios** - HTTP requests with JWT
7. **Mock Data** - Placeholder until backend ready

## Next Steps to See Real Data

1. **Create Backend Endpoints** in Spring Boot:
   ```java
   @GetMapping("/api/dashboard/stats")
   public DashboardStats getStats() {
       // Query MongoDB for today's stats
       return statsService.getTodayStats();
   }
   ```

2. **Connect Frontend** to Real APIs:
   ```javascript
   const loadDashboardData = async () => {
       const stats = await api.get('/api/dashboard/stats');
       setStats(stats.data);
   };
   ```

3. **Test** with Real Data:
   - Add orders through system
   - Refresh dashboard
   - See real numbers appear

That's it! You now have a complete professional dashboard matching your PHP design! 🎉
