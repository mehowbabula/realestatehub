import { NextResponse } from "next/server";
import { withMonitoring } from "@/lib/monitoring";

const healthCheck = async () => {
  try {
    // Add basic health checks here if needed
    // e.g., database connectivity, external services, etc.
    
    return NextResponse.json({ 
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: "unhealthy", 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
};

export const GET = withMonitoring(healthCheck, 'health-check');