#!/bin/bash

# Script to populate sample feedback data
# Run this after the backend is running

BASE_URL="http://localhost:8080/api"

echo "=== Populating Sample Feedback Data ==="
echo ""

# Step 1: Login and get JWT token
echo "1️⃣  Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Login failed!"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Logged in successfully!"
echo ""

# Step 2: Create sample feedback entries
echo "2️⃣  Creating sample feedback..."
echo ""

# Feedback 1 - Excellent service
echo "Creating feedback 1..."
curl -s -X POST "$BASE_URL/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderNumber": "ORD-001",
    "tableNumber": "Table 5",
    "totalAmount": 45000,
    "rating": 5,
    "comments": "Excellent service and food! Everything was perfect."
  }' | jq '.'

# Feedback 2 - Good but could improve
echo ""
echo "Creating feedback 2..."
curl -s -X POST "$BASE_URL/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderNumber": "ORD-002",
    "tableNumber": "Room 2",
    "totalAmount": 78000,
    "rating": 4,
    "comments": "Good food, fast delivery. Could be a bit warmer."
  }' | jq '.'

# Feedback 3 - Average experience
echo ""
echo "Creating feedback 3..."
curl -s -X POST "$BASE_URL/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderNumber": "ORD-003",
    "tableNumber": "Table 1",
    "totalAmount": 32000,
    "rating": 3,
    "comments": "Average experience. Food was okay but service was slow."
  }' | jq '.'

# Feedback 4 - Amazing experience
echo ""
echo "Creating feedback 4..."
curl -s -X POST "$BASE_URL/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderNumber": "ORD-004",
    "tableNumber": "Table 3",
    "totalAmount": 55000,
    "rating": 5,
    "comments": "Amazing! Will definitely come back."
  }' | jq '.'

# Feedback 5 - Great atmosphere
echo ""
echo "Creating feedback 5..."
curl -s -X POST "$BASE_URL/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderNumber": "ORD-005",
    "tableNumber": "Room 1",
    "totalAmount": 120000,
    "rating": 4,
    "comments": "Great atmosphere and delicious food."
  }' | jq '.'

# Feedback 6 - Perfect dining
echo ""
echo "Creating feedback 6..."
curl -s -X POST "$BASE_URL/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderNumber": "ORD-006",
    "tableNumber": "Table 2",
    "totalAmount": 67000,
    "rating": 5,
    "comments": "Perfect dining experience. Highly recommended!"
  }' | jq '.'

# Feedback 7 - Needs improvement
echo ""
echo "Creating feedback 7..."
curl -s -X POST "$BASE_URL/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "orderNumber": "ORD-007",
    "tableNumber": "Room 3",
    "totalAmount": 41000,
    "rating": 2,
    "comments": "Food was cold and service took too long. Not satisfied."
  }' | jq '.'

echo ""
echo "=== Verifying Feedback Data ==="
echo ""

# Check total feedback count
echo "📊 Total feedback in database:"
curl -s -X GET "$BASE_URL/feedback?size=100" \
  -H "Authorization: Bearer $TOKEN" | jq '.totalItems'

echo ""
echo "🎯 Recent feedback (dashboard endpoint):"
curl -s -X GET "$BASE_URL/dashboard/recent-feedback" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "✅ Sample feedback data created successfully!"
echo ""
echo "🌐 View feedback at: http://localhost:5173/feedback"
