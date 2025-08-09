-- Add subscription system to existing schema

-- Add enums for roles and subscription status
-- Note: SQLite doesn't support enums directly, so we'll use string constraints

-- Add subscription fields to User table
ALTER TABLE User ADD COLUMN bio TEXT;
ALTER TABLE User ADD COLUMN packageId TEXT;
ALTER TABLE User ADD COLUMN subscriptionStatus TEXT DEFAULT 'FREE' CHECK (subscriptionStatus IN ('FREE', 'PENDING', 'ACTIVE', 'CANCELED', 'EXPIRED'));
ALTER TABLE User ADD COLUMN subscriptionEnd DATETIME;
ALTER TABLE User ADD COLUMN stripeCustomerId TEXT;

-- Update role column to use proper role values
-- Current role is string with default "user", we'll keep it compatible
-- but document the expected values: USER, AGENT, EXPERT

-- Create Package table
CREATE TABLE Package (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- in cents
    interval TEXT NOT NULL, -- 'month' or 'year'
    listingsMax INTEGER NOT NULL,
    features TEXT NOT NULL, -- JSON string
    stripePriceId TEXT UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create EmailVerification table
CREATE TABLE EmailVerification (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    userId TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Add foreign key constraint for packageId (if supported by your SQLite version)
-- CREATE INDEX idx_user_package ON User(packageId);

-- Insert default packages
INSERT INTO Package (id, name, description, price, interval, listingsMax, features, stripePriceId, active) VALUES
('pkg_agent_basic', 'Agent Basic', 'Perfect for new agents getting started', 3000, 'month', 5, '{"support": "email", "analytics": false, "marketing": false}', 'price_agent_basic_monthly', true),
('pkg_agent_standard', 'Agent Standard', 'For growing real estate professionals', 5000, 'month', 10, '{"support": "email", "analytics": false, "marketing": false}', 'price_agent_standard_monthly', true),
('pkg_agent_professional', 'Agent Professional', 'Advanced features for established agents', 10000, 'month', 20, '{"support": "priority_email", "analytics": false, "marketing": false}', 'price_agent_professional_monthly', true),
('pkg_expert_monthly', 'Real Estate Expert', 'Complete marketing suite with AI tools', 20000, 'month', 50, '{"support": "priority", "analytics": true, "marketing": true, "ai_blog": true, "social_media": true, "lead_capture": true, "booking_calendar": true}', 'price_expert_monthly', true),
('pkg_expert_yearly', 'Real Estate Expert (Yearly)', 'Complete marketing suite with 20% yearly discount', 192000, 'year', 50, '{"support": "priority", "analytics": true, "marketing": true, "ai_blog": true, "social_media": true, "lead_capture": true, "booking_calendar": true, "discount": "20%"}', 'price_expert_yearly', true);

-- Update existing users to have proper roles if needed
-- UPDATE User SET role = 'USER' WHERE role = 'user';
-- UPDATE User SET role = 'AGENT' WHERE role = 'agent';
-- UPDATE User SET role = 'EXPERT' WHERE role = 'expert';
