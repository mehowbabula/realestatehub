# Advanced Monitoring Setup Guide

This guide will help you set up comprehensive monitoring for the Real Estate Platform using Sentry for error tracking and application performance monitoring.

## Why Sentry?

Sentry provides:
- **Error Tracking**: Automatic error capture and reporting
- **Performance Monitoring**: Transaction tracing and performance insights
- **Release Tracking**: Monitor deployments and their impact
- **User Context**: See which users are affected by issues
- **Free Tier**: 5,000 errors/month + 10,000 performance units/month
- **Easy Integration**: Simple setup with Next.js

## Step 1: Sentry Account Setup

### 1.1 Create Sentry Account
1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account
3. Create a new project and select "Next.js"
4. Copy your DSN (Data Source Name)

### 1.2 Get Your Sentry Configuration
You'll need:
- **DSN**: Your project's DSN URL (e.g., `https://abc123@sentry.io/123456`)
- **Organization**: Your organization slug
- **Project**: Your project slug
- **Auth Token**: For releases (optional but recommended)

## Step 2: Environment Configuration

Add these variables to your `.env` file:

```bash
# Sentry Configuration
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
```

## Step 3: Features Included

The monitoring setup includes:

### 3.1 Error Boundary Components
- Automatic error capture in React components
- User-friendly error fallback UI
- Error ID tracking for support

### 3.2 Performance Monitoring
- API route performance tracking
- Database query monitoring
- Custom business metrics

### 3.3 User Context Tracking
- User session tracking
- Authentication state monitoring
- Feature usage analytics

### 3.4 Health Check Endpoint
- System health monitoring at `/api/health`
- Uptime tracking
- Environment status

### 3.5 Admin Monitoring Dashboard
- Real-time system status
- Error testing tools
- Metrics visualization

## Step 4: Deployment with Monitoring

### 4.1 Docker Build with Sentry
The application is configured to upload source maps during build:

```bash
# Build with Sentry integration
docker-compose up --build -d
```

### 4.2 Verify Monitoring
After deployment:

```bash
# Check health endpoint
curl https://yourdomain.com/api/health

# Test error tracking (admin only)
# Navigate to monitoring dashboard and click "Test Error Tracking"
```

## Step 5: Monitoring Features

### 5.1 Automatic Error Tracking
- All JavaScript errors are captured
- Server-side errors are logged
- User context is included

### 5.2 Performance Monitoring
- API response times
- Database query performance
- User session replays (10% sample)

### 5.3 Custom Metrics
- Business metric tracking
- Feature usage analytics
- User behavior insights

### 5.4 Alerting
Set up alerts in Sentry for:
- New error types
- High error rates
- Performance degradation
- User impact thresholds

## Step 6: Best Practices

### 6.1 Error Handling
```typescript
import { useErrorHandler } from '@/components/monitoring/error-boundary';

const { reportError } = useErrorHandler();

try {
  // Your code
} catch (error) {
  reportError(error, { context: 'user-action' });
}
```

### 6.2 Performance Tracking
```typescript
import { PerformanceMonitor } from '@/lib/monitoring';

const result = await PerformanceMonitor.measureAsync(
  'database-query',
  () => database.findMany()
);
```

### 6.3 User Context
```typescript
import { setUserContext } from '@/lib/monitoring';

setUserContext({
  id: user.id,
  email: user.email,
  username: user.username
});
```

## Free Tier Limits

Sentry's free tier includes:
- 5,000 errors per month
- 10,000 performance monitoring transactions per month
- 30-day data retention
- Unlimited team members
- Basic integrations

This is typically sufficient for small to medium applications.

## Alternative: Self-Hosted Monitoring Stack

If you prefer a self-hosted solution, you can set up:
- **Prometheus**: For metrics collection
- **Grafana**: For visualization dashboards
- **Loki**: For log aggregation
- **AlertManager**: For alerting

This requires more setup but provides unlimited usage.

## Troubleshooting

### Common Issues

1. **Sentry not capturing errors in development**
   - Errors are filtered out in development mode by default
   - Set `NODE_ENV=production` to test

2. **Source maps not uploaded**
   - Ensure `SENTRY_AUTH_TOKEN` is set
   - Check build logs for upload confirmation

3. **Performance data not showing**
   - Verify `tracesSampleRate` is set > 0
   - Check that routes are being hit

## Support and Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js Integration Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Error Tracking](https://docs.sentry.io/product/issues/)
