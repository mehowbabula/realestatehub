# TODO: Multi-Role Registration & Subscription System Implementation

## 📋 Overview
Implement a comprehensive multi-role registration and subscription system for the real estate platform with three user types: Regular Users (free), Real Estate Agents (paid tiers), and Real Estate Experts (premium).

## 🎯 User Types & Pricing

### 1. Regular User (Free)
- ✅ Can register for free
- ✅ Can browse properties
- ✅ Can contact agents/agencies

### 2. Real Estate Agent (Paid Tiers)
- 🔄 **Basic**: $30/month → up to 5 listings
- 🔄 **Standard**: $50/month → up to 10 listings  
- 🔄 **Professional**: $100/month → up to 20 listings
- ❌ No marketing toolkit
- ❌ No blog or analytics

### 3. Real Estate Expert (Premium)
- 🔄 **Expert**: $200/month (20% yearly discount = $160/month)
- ✅ Up to 50 listings
- ✅ Pro Marketing Toolkit
- ✅ Priority listing & agent support
- ✅ Agent Blog (AI-powered)
- ✅ Auto-post to Instagram, YouTube, Facebook, LinkedIn
- ✅ AI-generated reels / short videos
- ✅ Lead Capture Form + Booking Calendar
- ✅ Marketing & Lead Analytics Dashboard

## 🏗️ Implementation Tasks

### Phase 1: Database Schema Updates
- [ ] **Update Prisma Schema**
  - [ ] Add `Role` enum (USER, AGENT, EXPERT)
  - [ ] Extend User model with subscription fields
  - [ ] Create Package model for subscription tiers
  - [ ] Create EmailVerification model
  - [ ] Update existing models as needed
  - [ ] Run migration: `npx prisma migrate dev --name add-subscription-system`

### Phase 2: Authentication System Overhaul
- [ ] **Registration Flow**
  - [ ] Create new `/register` page (replace modal)
  - [ ] Multi-step registration form
  - [ ] Role selection interface
  - [ ] Package selection for paid users
  - [ ] Email verification system
  - [ ] Complete profile flow for paid users

- [ ] **Authentication Updates**
  - [ ] Update NextAuth configuration
  - [ ] Add role-based session management
  - [ ] Implement email verification workflow
  - [ ] Update login redirects based on user role

### Phase 3: Stripe Integration
- [ ] **Stripe Setup**
  - [ ] Configure Stripe products and prices in dashboard
  - [ ] Create checkout session API endpoint
  - [ ] Implement webhook handling for subscription events
  - [ ] Add subscription status tracking

- [ ] **Payment Flow**
  - [ ] Checkout session creation
  - [ ] Payment success/failure handling
  - [ ] Subscription renewal management
  - [ ] Cancellation handling

### Phase 4: Role-Based Dashboards
- [ ] **User Dashboard** (`/dashboard`)
  - [ ] Property browsing interface
  - [ ] Saved properties
  - [ ] Contact history

- [ ] **Agent Dashboard** (`/agent/dashboard`)
  - [ ] Listing management (respect package limits)
  - [ ] Lead tracking
  - [ ] Basic analytics
  - [ ] Subscription status display

- [ ] **Expert Dashboard** (`/expert/dashboard`)
  - [ ] Advanced listing management (up to 50)
  - [ ] Marketing toolkit integration
  - [ ] AI blog management
  - [ ] Social media auto-posting
  - [ ] Lead capture forms
  - [ ] Advanced analytics dashboard

### Phase 5: Feature Implementation
- [ ] **Listing System Updates**
  - [ ] Package-based listing limits
  - [ ] Enhanced listing creation for experts
  - [ ] Priority listing features
  - [ ] Listing expiration management

- [ ] **Marketing Features (Expert Only)**
  - [ ] AI-powered blog system
  - [ ] Social media integration (Instagram, YouTube, Facebook, LinkedIn)
  - [ ] AI-generated video/reel content
  - [ ] Lead capture form builder
  - [ ] Booking calendar integration
  - [ ] Advanced analytics dashboard

### Phase 6: API Endpoints
- [ ] **Authentication APIs**
  - [ ] `POST /api/auth/register` - Multi-role registration
  - [ ] `GET /api/auth/verify-email` - Email verification
  - [ ] `PUT /api/auth/complete-profile` - Profile completion

- [ ] **Package APIs**
  - [ ] `GET /api/packages` - Available packages
  - [ ] `GET /api/packages/:id` - Package details

- [ ] **Stripe APIs**
  - [ ] `POST /api/stripe/create-checkout-session` - Payment processing
  - [ ] `POST /api/stripe/webhook` - Subscription events
  - [ ] `GET /api/stripe/subscription-status` - User subscription info

- [ ] **Listing APIs (Enhanced)**
  - [ ] Package limit validation
  - [ ] Priority listing features
  - [ ] Bulk operations for experts

### Phase 7: UI/UX Components
- [ ] **Registration Components**
  - [ ] Role selection cards
  - [ ] Package comparison table
  - [ ] Multi-step form wizard
  - [ ] Email verification confirmation

- [ ] **Dashboard Components**
  - [ ] Role-specific navigation
  - [ ] Subscription status indicators
  - [ ] Package upgrade prompts
  - [ ] Usage analytics widgets

- [ ] **Marketing Components (Expert)**
  - [ ] Blog editor with AI assistance
  - [ ] Social media scheduler
  - [ ] Video/reel generator interface
  - [ ] Lead capture form builder
  - [ ] Analytics charts and metrics

## 🗂️ File Structure Changes

```
src/
├── app/
│   ├── register/                 # New registration page
│   │   └── page.tsx
│   ├── complete-profile/         # Profile completion for paid users
│   │   └── page.tsx
│   ├── dashboard/               # User dashboard
│   │   └── page.tsx
│   ├── agent/                   # Agent-specific pages
│   │   ├── dashboard/
│   │   └── listings/
│   ├── expert/                  # Expert-specific pages
│   │   ├── dashboard/
│   │   ├── marketing/
│   │   ├── blog/
│   │   └── analytics/
│   └── api/
│       ├── auth/
│       │   ├── register/
│       │   ├── verify-email/
│       │   └── complete-profile/
│       ├── packages/
│       └── stripe/
│           ├── create-checkout-session/
│           └── webhook/
├── components/
│   ├── auth/
│   │   ├── registration-wizard.tsx
│   │   ├── role-selector.tsx
│   │   └── package-selector.tsx
│   ├── dashboard/
│   │   ├── user-dashboard.tsx
│   │   ├── agent-dashboard.tsx
│   │   └── expert-dashboard.tsx
│   └── marketing/              # Expert marketing tools
│       ├── blog-editor.tsx
│       ├── social-scheduler.tsx
│       └── analytics-dashboard.tsx
└── lib/
    ├── stripe.ts              # Stripe utilities
    ├── packages.ts            # Package definitions
    └── permissions.ts         # Role-based permissions
```

## 🗄️ Database Schema Updates

### Updated User Model
```prisma
model User {
  id                 String    @id @default(cuid())
  email              String?   @unique
  name               String?
  image              String?
  emailVerified      DateTime?
  passwordHash       String?
  role               Role      @default(USER)
  phone              String?
  agencyName         String?
  bio                String?
  
  // Subscription fields
  packageId          String?
  subscriptionStatus SubscriptionStatus @default(FREE)
  subscriptionEnd    DateTime?
  stripeCustomerId   String?
  
  // Existing fields...
  resetToken         String?
  resetTokenExpiry   DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  
  // Relations
  package            Package?  @relation(fields: [packageId], references: [id])
  accounts           Account[]
  sessions           Session[]
  listings           Listing[] @relation("UserListings")
  // ... other relations
}

enum Role {
  USER
  AGENT
  EXPERT
}

enum SubscriptionStatus {
  FREE
  PENDING
  ACTIVE
  CANCELED
  EXPIRED
}

model Package {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Int      // in cents
  interval    String   // month, year
  listingsMax Int
  features    Json
  stripePriceId String @unique
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  users       User[]
}

model EmailVerification {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  createdAt DateTime @default(now())
  expiresAt DateTime
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 🚀 Implementation Priority

### Sprint 1 (Week 1-2)
1. Database schema updates and migration
2. Basic registration flow
3. Email verification system
4. Role-based authentication

### Sprint 2 (Week 3-4)
1. Stripe integration
2. Package selection and checkout
3. Subscription webhook handling
4. Basic dashboards

### Sprint 3 (Week 5-6)
1. Enhanced listing system with limits
2. Agent dashboard features
3. User dashboard improvements
4. Subscription management

### Sprint 4 (Week 7-8)
1. Expert dashboard
2. Marketing toolkit foundation
3. AI blog system
4. Social media integration

### Sprint 5 (Week 9-10)
1. Advanced analytics
2. Lead capture system
3. Video/reel generation
4. Testing and optimization

## 🧪 Testing Checklist

- [ ] Registration flow for all user types
- [ ] Email verification process
- [ ] Stripe payment integration
- [ ] Subscription webhook handling
- [ ] Role-based access control
- [ ] Package limit enforcement
- [ ] Dashboard functionality
- [ ] Mobile responsiveness
- [ ] Performance optimization

## 🚢 Deployment Considerations

### Environment Variables
```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx
EMAIL_FROM=noreply@yourdomain.com

# App
NEXTAUTH_URL=https://yourdomain.com
BASE_URL=https://yourdomain.com
```

### Stripe Products Setup
1. Create products in Stripe Dashboard:
   - Agent Basic ($30/month)
   - Agent Standard ($50/month)  
   - Agent Professional ($100/month)
   - Expert Monthly ($200/month)
   - Expert Yearly ($1920/year = 20% discount)

### Database Migration
```bash
# Generate migration
npx prisma migrate dev --name add-subscription-system

# Deploy to production
npx prisma migrate deploy
```

## 📝 Notes

- Start with SQLite for development, migrate to PostgreSQL for production
- Implement proper error handling and logging
- Add comprehensive input validation
- Consider rate limiting for API endpoints
- Implement proper backup and recovery procedures
- Add monitoring and alerting for subscription events
- Ensure GDPR compliance for user data
- Test thoroughly with Stripe test mode before going live

## ✅ Success Criteria

- [ ] All three user types can register successfully
- [ ] Payment processing works correctly
- [ ] Role-based access is properly enforced
- [ ] Package limits are respected
- [ ] Email verification is reliable
- [ ] Dashboards are functional and responsive
- [ ] Expert marketing features are operational
- [ ] System is production-ready and scalable

---

**Estimated Timeline**: 10-12 weeks for full implementation
**Priority**: High - Core business functionality
**Dependencies**: Stripe account setup, Email service configuration
**Risk Level**: Medium - Complex integration with external services
