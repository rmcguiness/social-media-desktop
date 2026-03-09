import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let dbConnected = false;
  
  try {
    // Test database connectivity with a simple query
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch (error) {
    console.error('Health check DB error:', error);
    dbConnected = false;
  }

  const status = dbConnected ? 'ok' : 'degraded';
  
  return NextResponse.json({ 
    status,
    db: dbConnected,
    timestamp: new Date().toISOString(),
  }, {
    status: dbConnected ? 200 : 503,
  });
}
