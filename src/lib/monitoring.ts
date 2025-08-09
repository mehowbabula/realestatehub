import * as Sentry from '@sentry/nextjs';

// Performance monitoring utilities
export class PerformanceMonitor {
  /**
   * Measure the execution time of an async function
   */
  static async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    op = 'function'
  ): Promise<T> {
    return Sentry.startSpan(
      {
        name,
        op,
      },
      async () => {
        try {
          const result = await fn();
          return result;
        } catch (error) {
          Sentry.captureException(error);
          throw error;
        }
      }
    );
  }

  /**
   * Measure synchronous function execution
   */
  static measure<T>(
    name: string,
    fn: () => T,
    op = 'function'
  ): T {
    return Sentry.startSpan(
      {
        name,
        op,
      },
      () => {
        try {
          const result = fn();
          return result;
        } catch (error) {
          Sentry.captureException(error);
          throw error;
        }
      }
    );
  }
}

// Decorator for automatic performance monitoring
export function monitored(name?: string, op = 'function') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const spanName = name || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      return PerformanceMonitor.measureAsync(
        spanName,
        () => originalMethod.apply(this, args),
        op
      );
    };

    return descriptor;
  };
}

// Database query monitoring
export const monitorDatabaseQuery = async <T>(
  query: string,
  operation: () => Promise<T>,
  op = 'db.query'
): Promise<T> => {
  return Sentry.startSpan(
    {
      name: query,
      op,
    },
    operation
  );
};

// API route monitoring wrapper
export function withMonitoring<T extends (...args: any[]) => any>(
  handler: T,
  name?: string
): T {
  return (async (...args: any[]) => {
    const routeName = name || 'api-route';
    
    return Sentry.startSpan(
      {
        name: routeName,
        op: 'http.server',
      },
      async () => {
        try {
          const result = await handler(...args);
          return result;
        } catch (error) {
          Sentry.captureException(error);
          throw error;
        }
      }
    );
  }) as T;
}

// User context utilities
export const setUserContext = (user: {
  id: string;
  email?: string;
  username?: string;
}) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Custom event tracking
export const trackEvent = (
  eventName: string,
  data?: Record<string, any>,
  level: 'info' | 'warning' | 'error' = 'info'
) => {
  Sentry.addBreadcrumb({
    message: eventName,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
};

// Business metrics tracking
export const trackBusinessMetric = (
  metric: string,
  value: number,
  tags?: Record<string, string>
) => {
  Sentry.captureMessage(`Business Metric: ${metric}`, {
    level: 'info',
    extra: {
      metric,
      value,
      timestamp: new Date().toISOString(),
    },
    tags,
  });
};

// Feature flag tracking
export const trackFeatureUsage = (feature: string, userId?: string) => {
  trackEvent('feature_used', {
    feature,
    userId,
    timestamp: new Date().toISOString(),
  });
};
