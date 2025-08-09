# API Tests

This directory contains basic API tests for the GlobalRealEstate platform.

## Test Coverage

### Authentication Tests
- ✅ User registration
- ✅ User login
- ✅ Password reset flow

### Listings Tests  
- ✅ Create listing
- ✅ Get listings
- ✅ Update listing
- ✅ Delete listing

### Leads Tests
- ✅ Create lead
- ✅ Get leads

### Messages Tests
- ✅ Create conversation
- ✅ Send message
- ✅ Get messages

## Running Tests

```bash
# Run all API tests
npm run test:api

# Run specific test file
npm run test:api -- --testNamePattern="listings"
```

## Test Structure

Each test file follows this pattern:
1. Setup test data
2. Make API requests
3. Validate responses
4. Cleanup test data
