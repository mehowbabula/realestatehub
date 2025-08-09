#!/bin/bash

# API Tests for GlobalRealEstate Platform
# Basic tests for listings, leads, and messages functionality

BASE_URL="http://localhost:5544"

echo "🧪 Starting API Tests for GlobalRealEstate Platform"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0

# Generate random email for testing
RANDOM_EMAIL="testapi$(date +%s)@example.com"

# Test helper function
test_api() {
    local test_name="$1"
    local expected_status="$2"
    local url="$3"
    local method="$4"
    local data="$5"
    local headers="$6"
    
    echo "Testing: $test_name"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" $headers "$url")
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X "$method" $headers -H "Content-Type: application/json" -d "$data" "$url")
    fi
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $test_name (Status: $http_code)"
        PASSED=$((PASSED + 1))
        if [ ! -z "$body" ] && [ "$body" != "null" ]; then
            echo "   Response: $(echo $body | head -c 100)..."
        fi
    else
        echo -e "${RED}❌ FAIL${NC} - $test_name (Expected: $expected_status, Got: $http_code)"
        echo "   Response: $body"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

echo "🔐 Testing Authentication APIs"
echo "------------------------------"

# Test 1: User Registration
test_api "User Registration" 201 "$BASE_URL/api/auth/register" "POST" "{
    \"name\": \"Test User API\",
    \"email\": \"$RANDOM_EMAIL\",
    \"password\": \"password123\",
    \"phone\": \"555-0123\",
    \"agencyName\": \"Test Agency API\"
}"

# Test 2: Password Reset Request
test_api "Password Reset Request" 200 "$BASE_URL/api/auth/forgot-password" "POST" "{
    \"email\": \"$RANDOM_EMAIL\"
}"

echo "📋 Testing Listings APIs"
echo "------------------------"

# Test 3: Get Listings (Public)
test_api "Get Listings" 200 "$BASE_URL/api/listings" "GET"

# Test 4: Create Listing (This will likely fail without auth, but tests the endpoint)
test_api "Create Listing (Unauthenticated)" 401 "$BASE_URL/api/listings" "POST" '{
    "title": "Test Property",
    "description": "A beautiful test property",
    "price": 500000,
    "currency": "USD",
    "location": "Test City, Test State",
    "type": "house",
    "status": "active"
}'

echo "📞 Testing Leads APIs"
echo "---------------------"

# Test 5: Create Lead (This will likely fail without auth)
test_api "Create Lead (Unauthenticated)" 401 "$BASE_URL/api/leads" "POST" '{
    "agentId": "test-agent-id",
    "message": "I am interested in your property"
}'

echo "💬 Testing Conversations APIs"
echo "-----------------------------"

# Test 6: Get Conversations (This will likely fail without auth)
test_api "Get Conversations (Unauthenticated)" 401 "$BASE_URL/api/conversations" "GET"

# Test 7: Create Conversation (This will likely fail without auth)
test_api "Create Conversation (Unauthenticated)" 401 "$BASE_URL/api/conversations" "POST" '{
    "participantIds": ["user1", "user2"]
}'

echo "📧 Testing Additional Auth Endpoints"
echo "-----------------------------------"

# Test 8: Email Verification (Test endpoint existence)
test_api "Verify Email Token (Invalid)" 400 "$BASE_URL/api/auth/verify-email" "POST" '{
    "token": "invalid-token"
}'

# Test 9: Reset Password (Invalid token)
test_api "Reset Password (Invalid Token)" 400 "$BASE_URL/api/auth/reset-password" "POST" '{
    "token": "invalid-token",
    "password": "newpassword123"
}'

echo "================================================="
echo "🧪 API Test Results Summary"
echo "================================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo "Total Tests: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. This may be expected for authentication-required endpoints.${NC}"
    exit 1
fi
