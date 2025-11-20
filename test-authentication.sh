#!/bin/bash

###############################################################################
# JWT AUTHENTICATION TEST SCRIPT
#
# TEACHING MOMENT FOR BEGINNERS:
# This script tests the complete authentication flow:
# 1. Register a new user
# 2. Login to get a JWT token
# 3. Try accessing protected endpoint WITHOUT token (should fail)
# 4. Try accessing protected endpoint WITH token (should work)
###############################################################################

BASE_URL="http://localhost:8080/api"

echo "========================================================================"
echo "🧪 TESTING JWT AUTHENTICATION SYSTEM"
echo "========================================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

###############################################################################
# STEP 1: REGISTER A NEW USER
###############################################################################
echo "------------------------------------------------------------------------"
echo "${YELLOW}📝 STEP 1: Registering a new user...${NC}"
echo "------------------------------------------------------------------------"
echo "Endpoint: POST /api/auth/register"
echo "Request Body:"
cat << EOF
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123!",
  "fullName": "Test User"
}
EOF
echo ""
echo "Response:"

REGISTER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User"
  }')

HTTP_STATUS=$(echo "$REGISTER_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | sed '/HTTP_STATUS/d')

echo "$REGISTER_BODY" | jq '.'
echo ""

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "${GREEN}✅ SUCCESS: User registered successfully${NC}"
else
    echo "${RED}❌ FAILED: Registration failed with status $HTTP_STATUS${NC}"
    echo "Note: If user already exists, try deleting from MongoDB or use different username"
fi

echo ""
sleep 2

###############################################################################
# STEP 2: LOGIN AND GET JWT TOKEN
###############################################################################
echo "------------------------------------------------------------------------"
echo "${YELLOW}🔑 STEP 2: Logging in to get JWT token...${NC}"
echo "------------------------------------------------------------------------"
echo "Endpoint: POST /api/auth/login"
echo "Request Body:"
cat << EOF
{
  "username": "testuser",
  "password": "Test123!"
}
EOF
echo ""
echo "Response:"

LOGIN_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }')

HTTP_STATUS=$(echo "$LOGIN_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '/HTTP_STATUS/d')

echo "$LOGIN_BODY" | jq '.'
echo ""

if [ "$HTTP_STATUS" -eq 200 ]; then
    # Extract JWT token from response
    JWT_TOKEN=$(echo "$LOGIN_BODY" | jq -r '.token')
    echo "${GREEN}✅ SUCCESS: Login successful${NC}"
    echo ""
    echo "🎫 JWT Token (first 50 characters):"
    echo "${JWT_TOKEN:0:50}..."
    echo ""
    echo "TEACHING MOMENT:"
    echo "This token is like a VIP wristband at a concert."
    echo "You show it with every request to prove you're logged in."
    echo "It contains your username encoded inside (but it's signed so nobody can fake it)"
else
    echo "${RED}❌ FAILED: Login failed with status $HTTP_STATUS${NC}"
    exit 1
fi

echo ""
sleep 2

###############################################################################
# STEP 3: TRY ACCESSING PROTECTED ENDPOINT WITHOUT TOKEN
###############################################################################
echo "------------------------------------------------------------------------"
echo "${YELLOW}🚫 STEP 3: Trying to access protected endpoint WITHOUT token...${NC}"
echo "------------------------------------------------------------------------"
echo "Endpoint: GET /api/menu-items"
echo "Authorization Header: (none)"
echo ""
echo "Response:"

NO_TOKEN_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET \
  "${BASE_URL}/menu-items")

HTTP_STATUS=$(echo "$NO_TOKEN_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
NO_TOKEN_BODY=$(echo "$NO_TOKEN_RESPONSE" | sed '/HTTP_STATUS/d')

echo "$NO_TOKEN_BODY"
echo ""

if [ "$HTTP_STATUS" -eq 401 ] || [ "$HTTP_STATUS" -eq 403 ]; then
    echo "${GREEN}✅ SUCCESS: Correctly blocked access (HTTP $HTTP_STATUS)${NC}"
    echo "This is GOOD! It means our security is working."
else
    echo "${RED}⚠️  WARNING: Expected 401/403 but got $HTTP_STATUS${NC}"
fi

echo ""
sleep 2

###############################################################################
# STEP 4: ACCESS PROTECTED ENDPOINT WITH VALID TOKEN
###############################################################################
echo "------------------------------------------------------------------------"
echo "${YELLOW}🎫 STEP 4: Accessing protected endpoint WITH valid token...${NC}"
echo "------------------------------------------------------------------------"
echo "Endpoint: GET /api/menu-items"
echo "Authorization Header: Bearer <token>"
echo ""
echo "Response:"

WITH_TOKEN_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET \
  "${BASE_URL}/menu-items" \
  -H "Authorization: Bearer ${JWT_TOKEN}")

HTTP_STATUS=$(echo "$WITH_TOKEN_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
WITH_TOKEN_BODY=$(echo "$WITH_TOKEN_RESPONSE" | sed '/HTTP_STATUS/d')

echo "$WITH_TOKEN_BODY" | jq '.'
echo ""

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "${GREEN}✅ SUCCESS: Access granted with valid token!${NC}"
    echo "This proves JWT authentication is working!"
else
    echo "${RED}❌ FAILED: Access denied with status $HTTP_STATUS${NC}"
fi

echo ""

###############################################################################
# STEP 5: TRY WITH INVALID TOKEN
###############################################################################
echo "------------------------------------------------------------------------"
echo "${YELLOW}🚫 STEP 5: Trying with FAKE/INVALID token...${NC}"
echo "------------------------------------------------------------------------"
echo "Endpoint: GET /api/menu-items"
echo "Authorization Header: Bearer fake-invalid-token"
echo ""
echo "Response:"

FAKE_TOKEN_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET \
  "${BASE_URL}/menu-items" \
  -H "Authorization: Bearer fake-invalid-token-12345")

HTTP_STATUS=$(echo "$FAKE_TOKEN_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
FAKE_TOKEN_BODY=$(echo "$FAKE_TOKEN_RESPONSE" | sed '/HTTP_STATUS/d')

echo "$FAKE_TOKEN_BODY"
echo ""

if [ "$HTTP_STATUS" -eq 401 ] || [ "$HTTP_STATUS" -eq 403 ]; then
    echo "${GREEN}✅ SUCCESS: Correctly rejected fake token (HTTP $HTTP_STATUS)${NC}"
    echo "This is GOOD! It means our token validation is working."
else
    echo "${RED}⚠️  WARNING: Expected 401/403 but got $HTTP_STATUS${NC}"
fi

echo ""

###############################################################################
# SUMMARY
###############################################################################
echo "========================================================================"
echo "${GREEN}✅ ALL TESTS COMPLETED${NC}"
echo "========================================================================"
echo ""
echo "WHAT YOU JUST LEARNED:"
echo "----------------------"
echo "1. ✅ User Registration - Creating new accounts"
echo "2. ✅ User Login - Authenticating and receiving JWT token"
echo "3. ✅ Protected Endpoints - Cannot access without valid token"
echo "4. ✅ Token Authorization - Can access with valid token"
echo "5. ✅ Token Validation - Fake tokens are rejected"
echo ""
echo "This is how JWT (JSON Web Token) authentication works!"
echo ""
echo "NEXT STEPS:"
echo "-----------"
echo "• Store the JWT token in your frontend (localStorage or cookies)"
echo "• Send 'Authorization: Bearer <token>' header with every request"
echo "• Token expires after ${JWT_EXPIRATION:-24 hours} - then user needs to login again"
echo "• You can decode the token at https://jwt.io to see what's inside"
echo ""
echo "CLEAN UP:"
echo "---------"
echo "To delete the test user from MongoDB:"
echo "docker exec -it smartmenu-mongodb mongosh --eval 'use smartmenu; db.users.deleteOne({username: \"testuser\"})'"
echo ""
