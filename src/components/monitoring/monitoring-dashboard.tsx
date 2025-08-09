'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Activity, RefreshCw } from 'lucide-react';
import { trackEvent, trackBusinessMetric } from '@/lib/monitoring';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'unknown';
  timestamp: string;
  uptime?: number;
  environment?: string;
  error?: string;
}

interface MonitoringDashboardProps {
  isAdmin?: boolean;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ 
  isAdmin = false 
}) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'unknown',
    timestamp: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      setHealthStatus({
        status: response.ok ? 'healthy' : 'unhealthy',
        timestamp: data.timestamp || new Date().toISOString(),
        uptime: data.uptime,
        environment: data.environment,
        error: data.error
      });

      // Track the health check event
      trackEvent('health_check_performed', {
        status: response.ok ? 'healthy' : 'unhealthy',
        response_time: Date.now()
      });

    } catch (error) {
      setHealthStatus({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Network error'
      });

      trackEvent('health_check_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testError = () => {
    // Intentionally throw an error for testing monitoring
    throw new Error('Test error for monitoring system');
  };

  const testBusinessMetric = () => {
    // Test business metric tracking
    trackBusinessMetric('test_metric', Math.random() * 100, {
      component: 'monitoring_dashboard',
      user_type: isAdmin ? 'admin' : 'user'
    });
  };

  useEffect(() => {
    checkHealth();
    
    // Set up periodic health checks
    const interval = setInterval(checkHealth, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    const variants = {
      healthy: 'default' as const,
      unhealthy: 'destructive' as const,
      unknown: 'secondary' as const
    };

    return (
      <Badge variant={variants[healthStatus.status]}>
        {healthStatus.status.toUpperCase()}
      </Badge>
    );
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (!isAdmin) {
    return null; // Only show for admin users
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          {getStatusIcon()}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {getStatusBadge()}
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {healthStatus.uptime && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Uptime: {formatUptime(healthStatus.uptime)}
              </p>
            </div>
          )}
          
          {healthStatus.environment && (
            <div className="mt-1">
              <p className="text-xs text-muted-foreground">
                Environment: {healthStatus.environment}
              </p>
            </div>
          )}
          
          {healthStatus.error && (
            <div className="mt-2">
              <p className="text-xs text-red-600">
                Error: {healthStatus.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Monitoring Tools</CardTitle>
          <CardDescription>
            Test and manage monitoring features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={testError}
            className="w-full"
          >
            Test Error Tracking
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={testBusinessMetric}
            className="w-full"
          >
            Test Metrics
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {new Date(healthStatus.timestamp).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringDashboard;
