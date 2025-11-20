#!/bin/bash
# MenuItem API Testing Script
# This demonstrates all CRUD operations

API_BASE="http://localhost:8080/api/menu-items"

echo "========================================="
echo "🍕 SmartMenu MenuItem API Test Suite"
echo "========================================="
echo ""

# Test 1: Create a menu item
echo "📝 Test 1: CREATE a new menu item (POST)"
echo "Command: POST $API_BASE"
RESPONSE=$(curl -s -X POST "$API_BASE" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza with tomato, mozzarella, and basil",
    "price": 12.99,
    "category": "Pizza",
    "imageUrl": "https://example.com/pizza.jpg",
    "available": true,
    "allergens": ["gluten", "dairy"],
    "prepTimeMinutes": 15,
    "featured": true
  }')

echo "$RESPONSE" | python3 -m json.tool
ITEM_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "✅ Created item with ID: $ITEM_ID"
echo ""

# Test 2: Get all menu items
echo "📖 Test 2: GET all menu items"
echo "Command: GET $API_BASE"
curl -s "$API_BASE" | python3 -m json.tool
echo "✅ Retrieved all menu items"
echo ""

# Test 3: Get one menu item by ID
echo "🔍 Test 3: GET single menu item by ID"
echo "Command: GET $API_BASE/$ITEM_ID"
curl -s "$API_BASE/$ITEM_ID" | python3 -m json.tool
echo "✅ Retrieved menu item details"
echo ""

# Test 4: Update menu item
echo "✏️  Test 4: UPDATE menu item (PUT)"
echo "Command: PUT $API_BASE/$ITEM_ID"
curl -s -X PUT "$API_BASE/$ITEM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "name": "Margherita Pizza (Updated!)",
    "description": "Classic Italian pizza - NOW WITH EXTRA CHEESE!",
    "price": 14.99,
    "category": "Pizza",
    "imageUrl": "https://example.com/pizza.jpg",
    "available": true,
    "allergens": ["gluten", "dairy"],
    "prepTimeMinutes": 20,
    "featured": true
  }' | python3 -m json.tool
echo "✅ Updated menu item"
echo ""

# Test 5: Toggle availability
echo "🔄 Test 5: TOGGLE availability (PATCH)"
echo "Command: PATCH $API_BASE/$ITEM_ID/toggle"
curl -s -X PATCH "$API_BASE/$ITEM_ID/toggle" | python3 -m json.tool
echo "✅ Toggled availability (should be false now)"
echo ""

# Toggle again
echo "🔄 Test 5b: TOGGLE availability again"
curl -s -X PATCH "$API_BASE/$ITEM_ID/toggle" | python3 -m json.tool
echo "✅ Toggled availability back (should be true now)"
echo ""

# Test 6: Get by user ID
echo "👤 Test 6: GET menu items by user ID"
echo "Command: GET $API_BASE/user/user123"
curl -s "$API_BASE/user/user123" | python3 -m json.tool
echo "✅ Retrieved items for user123"
echo ""

# Test 7: Get available items only
echo "✅ Test 7: GET available items only"
echo "Command: GET $API_BASE/user/user123/available"
curl -s "$API_BASE/user/user123/available" | python3 -m json.tool
echo "✅ Retrieved available items for user123"
echo ""

# Test 8: Delete menu item
echo "🗑️  Test 8: DELETE menu item"
echo "Command: DELETE $API_BASE/$ITEM_ID"
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_BASE/$ITEM_ID")
echo "HTTP Response Code: $RESPONSE_CODE"
if [ "$RESPONSE_CODE" = "204" ]; then
  echo "✅ Deleted menu item (HTTP 204 No Content)"
else
  echo "❌ Delete failed"
fi
echo ""

# Test 9: Verify deletion (should get 404)
echo "🔍 Test 9: Verify deletion (should get 404)"
echo "Command: GET $API_BASE/$ITEM_ID"
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/$ITEM_ID")
echo "HTTP Response Code: $RESPONSE_CODE"
if [ "$RESPONSE_CODE" = "404" ]; then
  echo "✅ Confirmed: Item no longer exists (HTTP 404)"
else
  echo "❌ Item still exists!"
fi
echo ""

echo "========================================="
echo "✅ All tests complete!"
echo "========================================="
