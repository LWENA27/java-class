#!/bin/bash
# Script to populate the database with sample data

echo "=== Populating SmartMenu Database with Sample Data ==="

# Get JWT token
echo "1. Logging in..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed. Please ensure backend is running and user exists."
    exit 1
fi

echo "✅ Login successful"
echo ""

# Create menu items
echo "2. Creating menu items..."

curl -s -X POST http://localhost:8080/api/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Ugali & Fish",
    "description": "Traditional Tanzanian meal with fresh fish",
    "price": 15000,
    "category": "Main Course",
    "available": true,
    "featured": true,
    "imageUrl": ""
  }' > /dev/null

curl -s -X POST http://localhost:8080/api/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Pilau & Chicken",
    "description": "Spiced rice with tender chicken",
    "price": 15000,
    "category": "Main Course",
    "available": true,
    "featured": true,
    "imageUrl": ""
  }' > /dev/null

curl -s -X POST http://localhost:8080/api/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Chips Mayai",
    "description": "Fried potato omelette",
    "price": 6000,
    "category": "Snacks",
    "available": true,
    "featured": false,
    "imageUrl": ""
  }' > /dev/null

curl -s -X POST http://localhost:8080/api/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Nyama Choma",
    "description": "Grilled meat with sides",
    "price": 25000,
    "category": "Main Course",
    "available": true,
    "featured": true,
    "imageUrl": ""
  }' > /dev/null

curl -s -X POST http://localhost:8080/api/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Samosa",
    "description": "Crispy fried pastry with meat filling",
    "price": 2000,
    "category": "Snacks",
    "available": true,
    "featured": false,
    "imageUrl": ""
  }' > /dev/null

echo "✅ Created 5 menu items"
echo ""

# Create more tables
echo "3. Creating additional tables..."

curl -s -X POST http://localhost:8080/api/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tableNumber":"T2","isRoom":false,"location":"Main Hall"}' > /dev/null

curl -s -X POST http://localhost:8080/api/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tableNumber":"T3","isRoom":false,"location":"Main Hall"}' > /dev/null

curl -s -X POST http://localhost:8080/api/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tableNumber":"T4","isRoom":false,"location":"Patio"}' > /dev/null

curl -s -X POST http://localhost:8080/api/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tableNumber":"R1","isRoom":true,"location":"VIP Room 1"}' > /dev/null

curl -s -X POST http://localhost:8080/api/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tableNumber":"R2","isRoom":true,"location":"VIP Room 2"}' > /dev/null

echo "✅ Created 5 additional tables"
echo ""

# Check dashboard stats
echo "4. Fetching dashboard stats..."
curl -s -X GET http://localhost:8080/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "=== Database Population Complete ==="
echo ""
echo "📊 You can now view real data on the dashboard at http://localhost:5173/dashboard"
echo "🍽️  Menu items: http://localhost:5173/manage-menu"
echo "🏠 Tables/Rooms: http://localhost:5173/qr-codes"
