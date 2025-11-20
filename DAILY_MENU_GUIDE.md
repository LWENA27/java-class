# 📅 Daily Menu Page - Implementation Guide

## ✅ New Page Created!

The **Daily Menu** page allows restaurant managers to control which menu items are available on specific dates and set special pricing.

---

## 🎯 Features

### 1. **Date Selection**
- Pick any date to manage the menu
- View what's available for that date
- Today's date selected by default

### 2. **Add Items to Daily Menu**
- Select from all available menu items
- Set optional special pricing (e.g., lunch specials)
- Mark as available or unavailable

### 3. **Toggle Availability**
- Quick ON/OFF switch for each item
- No need to open modal
- Instant update

### 4. **Edit Special Pricing**
- Change special price anytime
- Update availability status
- Keep items organized

### 5. **Remove Items**
- Delete items from daily menu
- Confirmation before removing
- Clean up old schedules

### 6. **Multi-Language Support**
- English, Swahili, French
- Language switcher in navbar
- All text translated

---

## 📱 Access the Page

### URL:
```
http://localhost:5174/daily-menu
```

### Navigation:
1. Login with `admin` / `admin123`
2. Click **"Today's Menu"** in the sidebar
3. Or go directly to: `/daily-menu`

---

## 🎨 Page Layout

```
┌──────────────────────────────────────────────────────┐
│ [☰] 🍽️ Smart Menu  [🇬🇧 English ▼]  Welcome [Logout] │
├──────────────────────────────────────────────────────┤
│ Daily Menu                                           │
│ Manage menu items available for specific dates      │
│                                                      │
│ ┌────────────────────────────────────────────────┐ │
│ │ Select Date                                    │ │
│ │ [📅 2025-11-20 ▼]  [+ Add to Daily Menu]      │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ ┌────────────────────────────────────────────────┐ │
│ │ Daily Menu (2025-11-20)                        │ │
│ ├────────┬───────┬────────┬────────┬──────┬─────┤ │
│ │Category│ Name  │Original│Special │Status│Acts │ │
│ ├────────┼───────┼────────┼────────┼──────┼─────┤ │
│ │Main    │Ugali  │15,000  │13,000 ✓│ ON   │✏️🗑️│ │
│ │Main    │Chips  │6,000   │N/A     │ ON   │✏️🗑️│ │
│ └────────┴───────┴────────┴────────┴──────┴─────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 🔧 How It Works

### 1. **Select a Date**
```jsx
<input 
    type="date" 
    value={selectedDate} 
    onChange={handleDateChange} 
/>
```
- Default: Today's date
- Change date to view/manage other days
- Each date has its own menu

### 2. **Add Item to Daily Menu**
Click **"Add to Daily Menu"** button:

**Modal Form:**
- **Menu Item** (required): Choose from dropdown
- **Special Price** (optional): Set discounted price
- **Available**: Checkbox (checked by default)

**Example:**
```
Menu Item: Main Dishes - Ugali & Fish (15,000 TSH)
Special Price: 13000
☑ Available for ordering
```

**Result:** Item appears in daily menu table with special price!

### 3. **Toggle Availability**
Use the ON/OFF switch in the Status column:
- **ON (Green)**: Available for ordering
- **OFF (Gray)**: Not available

**No confirmation needed** - changes instantly!

### 4. **Edit Special Price**
Click the **✏️ Edit** button:
- Update special price
- Change availability
- Save changes

### 5. **Remove from Daily Menu**
Click the **🗑️ Delete** button:
- Confirmation dialog appears
- Confirm to remove item
- Item removed from that date only

---

## 📊 Data Structure

### Daily Menu Item:
```javascript
{
    id: 1,
    menu_item_id: 1,
    item_name: 'Ugali & Fish',
    category_name: 'Main Dishes',
    category_id: 1,
    original_price: 15000,
    special_price: 13000,  // null if no special pricing
    is_available: true,
    date_available: '2025-11-20',
    photo: null
}
```

---

## 🌍 Multi-Language Translations

### English:
- Daily Menu
- Manage menu items available for specific dates
- Select Date
- Add to Daily Menu
- Original Price
- Special Price
- Item added to daily menu successfully!

### Kiswahili:
- Menyu ya Siku
- Simamia vyakula vinavyopatikana kwa siku maalum
- Chagua Tarehe
- Ongeza kwenye Menyu ya Siku
- Bei ya Asili
- Bei Maalum
- Chakula kimeongezwa kwenye menyu ya siku!

### Français:
- Menu Quotidien
- Gérez les articles disponibles pour des dates spécifiques
- Sélectionner la Date
- Ajouter au Menu Quotidien
- Prix Original
- Prix Spécial
- Article ajouté au menu quotidien avec succès!

---

## 🎯 Use Cases

### Use Case 1: **Lunch Specials**
**Scenario:** Restaurant offers special lunch prices Mon-Fri

**Steps:**
1. Select Monday's date
2. Add "Ugali & Fish" - Original: 15,000, Special: 12,000
3. Add "Pilau & Chicken" - Original: 12,000, Special: 10,000
4. Repeat for Tuesday-Friday
5. Customers see special prices on those dates

### Use Case 2: **Seasonal Menu**
**Scenario:** Special items only available on weekends

**Steps:**
1. Select Saturday's date
2. Add "Grilled Fish" (weekend special)
3. Mark as Available
4. Repeat for Sunday
5. Item only shows on weekends

### Use Case 3: **Sold Out Items**
**Scenario:** Kitchen runs out of an item

**Steps:**
1. Go to today's date
2. Find the item in daily menu
3. Toggle OFF the availability switch
4. Customers can't order it anymore
5. Toggle ON when available again

### Use Case 4: **Plan Ahead**
**Scenario:** Schedule next week's menu

**Steps:**
1. Select next Monday
2. Add all items for that day with special prices
3. Repeat for each day of the week
4. Menu automatically shows on those dates

---

## 💡 Key Features Explained

### 1. **Toggle Switch (Availability)**
```css
.toggle-switch {
    width: 50px;
    height: 24px;
    /* Beautiful ON/OFF switch */
}
```

**How it works:**
- Click once → Changes state
- No modal needed
- Visual feedback (green = ON, gray = OFF)
- Updates database instantly

**Benefits:**
- Fast to use
- Clear visual state
- No extra clicks

### 2. **Special Pricing**
**Original Price:** The normal menu item price
**Special Price:** Discounted price for that date

**Example:**
```
Ugali & Fish
Original: 15,000 TSH
Special: 13,000 TSH (Save 2,000!)
```

**Display:**
- Special price shown in green badge
- "N/A" if no special price
- Customers see special price in their menu

### 3. **Date-Specific Menus**
Each date has its own independent menu:
- Monday: Different items/prices
- Tuesday: Different items/prices
- etc.

**Benefits:**
- Flexible scheduling
- Plan promotions
- Manage availability
- Track daily offerings

---

## 🧪 Testing Checklist

### ✅ Functional Tests:

**Test 1: Add Item**
1. Go to `/daily-menu`
2. Select today's date
3. Click "Add to Daily Menu"
4. Select "Ugali & Fish"
5. Enter special price: 13000
6. Keep "Available" checked
7. Click "Add Item"
8. ✓ Success message appears
9. ✓ Item shows in table

**Test 2: Toggle Availability**
1. Find item in table
2. Click the ON/OFF switch
3. ✓ Switch changes color
4. ✓ Status text updates
5. Click again
6. ✓ Returns to previous state

**Test 3: Edit Special Price**
1. Click ✏️ Edit button
2. Modal opens with current data
3. Change special price to 14000
4. Click "Update Item"
5. ✓ Table shows new price

**Test 4: Remove Item**
1. Click 🗑️ Delete button
2. ✓ Confirmation dialog appears
3. Click "OK"
4. ✓ Item removed from table
5. ✓ Success message shows

**Test 5: Change Date**
1. Select tomorrow's date
2. ✓ Table updates (probably empty)
3. Add item for tomorrow
4. Go back to today
5. ✓ Today's items still there

**Test 6: Language Switching**
1. Change to Kiswahili in navbar
2. ✓ Page title: "Menyu ya Siku"
3. ✓ Button: "Ongeza kwenye Menyu ya Siku"
4. ✓ Table headers in Swahili
5. Change to French
6. ✓ Everything in French

---

## 📂 Files Created/Modified

### Created:
1. **`/frontend-react/src/pages/DailyMenu.jsx`** (560 lines)
   - Main component logic
   - State management
   - API calls (mock)
   - Modal handling
   - CRUD operations

2. **`/frontend-react/src/pages/DailyMenu.css`** (290 lines)
   - Toggle switch styles
   - Date picker styling
   - Table layout
   - Responsive design
   - Special price badges

### Modified:
1. **`/frontend-react/src/App.jsx`**
   - Added import for DailyMenu
   - Added route: `/daily-menu`

2. **`/frontend-react/src/i18n/translations.js`**
   - Added 18 new translation keys
   - English translations
   - Kiswahili translations
   - French translations

---

## 🎓 For Students/Learners

### Concepts Learned:

1. **Date Input Type**
```jsx
<input 
    type="date" 
    value="2025-11-20"
    onChange={handleDateChange}
/>
```
- HTML5 date picker
- Value format: YYYY-MM-DD
- Native browser calendar UI

2. **Toggle Switch Component**
```jsx
<label className="toggle-switch">
    <input type="checkbox" checked={isAvailable} />
    <span className="toggle-slider"></span>
</label>
```
- Custom checkbox styling
- CSS transforms for animation
- State-based styling

3. **Conditional Rendering**
```jsx
{item.special_price ? (
    <span className="badge">{formatPrice(item.special_price)}</span>
) : (
    <span>N/A</span>
)}
```
- Show different content based on data
- Ternary operator usage
- Fallback values

4. **Date Filtering**
```javascript
// Load items for specific date
const loadDailyMenuItems = async () => {
    const items = await api.get(`/api/daily-menu?date=${selectedDate}`);
};
```
- Query parameters
- Date-based filtering
- Dynamic data loading

5. **Price Formatting**
```javascript
const formatPrice = (price) => {
    return price ? `${parseFloat(price).toLocaleString()} TSH` : 'N/A';
};
```
- Number formatting
- Locale-aware display
- Null/undefined handling

---

## 🔗 Integration Points

### With Menu Management:
- Uses same menu items
- Shares categories
- References menu_item_id

### With Orders System:
- Customers see daily menu
- Only available items can be ordered
- Special prices applied automatically

### With QR Code Menu:
- Daily menu displayed to customers
- Special prices highlighted
- Unavailable items hidden

---

## 🚀 Next Steps (Future Enhancements)

1. **Bulk Operations**
   - Copy entire day's menu to another date
   - Apply special prices to multiple items at once
   - Mass availability toggle

2. **Templates**
   - Save daily menu as template
   - Apply template to multiple dates
   - "Monday template", "Weekend template", etc.

3. **Analytics**
   - Most popular daily items
   - Special price effectiveness
   - Daily revenue comparisons

4. **Notifications**
   - Alert when items low in stock
   - Remind to update daily menu
   - Customer notifications for specials

5. **Mobile App Integration**
   - Push notifications for specials
   - Real-time availability updates
   - Customer favorites tracking

---

## ✨ Summary

✅ **Created:** Daily Menu management page  
✅ **Features:** Date selection, special pricing, availability toggle  
✅ **UI:** Modal forms, toggle switches, responsive design  
✅ **i18n:** Full multi-language support (3 languages)  
✅ **Accessible:** From navbar and sidebar  

**Your restaurant can now manage daily menus with special pricing!** 📅🍽️

---

## 🎯 Key Takeaway

**Daily menus give restaurants flexibility:**
- Different items each day
- Special promotions
- Manage inventory
- Plan ahead
- Quick availability changes

This is a powerful feature for restaurants that want to offer variety and promotions! 🎉
