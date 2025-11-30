import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple health check endpoint
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'tuut-website',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}