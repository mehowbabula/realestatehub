# Multi-Role Subscription System - Quick Start Implementation Guide

## 🚀 Getting Started

### 1. Install Required Dependencies

```bash
npm install stripe @stripe/stripe-js
npm install nodemailer
npm install uuid
npm install @types/uuid @types/nodemailer # if using TypeScript
```

### 2. Environment Variables

Add to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration (using SendGrid as example)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key_here
EMAIL_FROM=noreply@yourdomain.com

# App URLs
NEXTAUTH_URL=http://localhost:5544
BASE_URL=http://localhost:5544
```

### 3. Database Schema Updates

First, backup your current database:
```bash
cp db/custom.db db/custom.db.backup
```

Then run the migration:
```bash
sqlite3 db/custom.db < migrations/add_subscription_system.sql
```

Or manually apply the schema changes using Prisma:
```bash
npx prisma db push
```

### 4. Create Stripe Products

In your Stripe Dashboard (test mode), create these products:

1. **Agent Basic** - $30/month - 5 listings
2. **Agent Standard** - $50/month - 10 listings  
3. **Agent Professional** - $100/month - 20 listings
4. **Real Estate Expert** - $200/month - 50 listings + features
5. **Real Estate Expert Yearly** - $1920/year (20% discount)

Copy the Price IDs and update them in `src/lib/packages.ts`.

## 📁 Next Steps - File Creation Priority

### Step 1: API Routes (Core Backend)

Create these API routes in order:

1. **`src/app/api/packages/route.ts`** - Package listing
2. **`src/app/api/auth/register/route.ts`** - Enhanced registration
3. **`src/app/api/auth/verify-email/route.ts`** - Email verification
4. **`src/app/api/stripe/create-checkout-session/route.ts`** - Payment processing
5. **`src/app/api/stripe/webhook/route.ts`** - Subscription events

### Step 2: Registration UI

1. **`src/app/register/page.tsx`** - Main registration page
2. **`src/components/auth/role-selector.tsx`** - Role selection component
3. **`src/components/auth/package-selector.tsx`** - Package selection
4. **`src/app/complete-profile/page.tsx`** - Profile completion for paid users

### Step 3: Enhanced Authentication

1. Update `src/lib/auth-options.ts` for role-based redirects
2. Create middleware for role-based access control
3. Update session handling for subscription status

### Step 4: Dashboards

1. **`src/app/dashboard/page.tsx`** - Default user dashboard
2. **`src/app/agent/dashboard/page.tsx`** - Agent dashboard
3. **`src/app/expert/dashboard/page.tsx`** - Expert dashboard

## 🔧 Implementation Example - Registration API

Here's a quick example of the enhanced registration API:

```typescript
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { getPackageById } from '@/lib/packages';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, packageId } = await request.json();

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Validate package for paid users
    if (role !== 'USER' && packageId) {
      const package_ = getPackageById(packageId);
      if (!package_) {
        return NextResponse.json({ error: 'Invalid package selected' }, { status: 400 });
      }
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Determine subscription status
    const subscriptionStatus = role === 'USER' ? 'FREE' : 'PENDING';

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        packageId: role === 'USER' ? null : packageId,
        subscriptionStatus,
        emailVerified: null, // Will be set after email verification
      }
    });

    // Generate email verification token
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.emailVerification.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt,
      }
    });

    // Send verification email
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    
    // TODO: Implement email sending
    // await sendVerificationEmail({
    //   to: email,
    //   name,
    //   verificationUrl,
    //   isFreeTier: role === 'USER'
    // });

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 📝 Development Workflow

1. **Phase 1**: Focus on core registration and authentication
2. **Phase 2**: Add Stripe integration and payment processing
3. **Phase 3**: Build role-based dashboards
4. **Phase 4**: Implement listing limits and package enforcement
5. **Phase 5**: Add expert features (marketing tools, AI blog, etc.)

## 🧪 Testing Strategy

1. **Unit Tests**: Test package validation and user role logic
2. **Integration Tests**: Test Stripe webhook handling
3. **End-to-End Tests**: Test complete registration and payment flow
4. **Load Tests**: Test system under subscription load

## 📞 Support & Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Prisma Docs**: https://www.prisma.io/docs/
- **NextAuth.js**: https://next-auth.js.org/

---

**Ready to start?** Begin with Step 1 - install dependencies and set up your environment variables. Then proceed with creating the API routes in the order listed above.

The complete implementation will transform your real estate platform into a comprehensive SaaS solution with multiple revenue streams!
