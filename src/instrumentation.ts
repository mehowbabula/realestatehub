export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { default: Sentry } = await import('@sentry/nextjs');
    
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      
      // Set tracesSampleRate to 1.0 to capture 100%
      // of the transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Capture profiling data
      profilesSampleRate: 1.0,
      
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
      
      beforeSend(event) {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      },
      
      // Add custom tags
      initialScope: {
        tags: {
          component: "server"
        }
      }
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const { default: Sentry } = await import('@sentry/nextjs');
    
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      
      // Set tracesSampleRate to 1.0 to capture 100%
      // of the transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
      
      beforeSend(event) {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      },
      
      // Add custom tags
      initialScope: {
        tags: {
          component: "edge"
        }
      }
    });
  }
}
