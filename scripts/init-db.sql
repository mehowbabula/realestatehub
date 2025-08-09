-- Initialize PostgreSQL database for Real Estate Platform
-- This script will be run automatically when the PostgreSQL container starts

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create database user if doesn't exist (optional)
-- Note: This is handled by Docker environment variables
