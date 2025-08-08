import { NextRequest, NextResponse } from 'next/server';
import { withSecurity } from '@/utils/apiSecurity';

// This endpoint would be called by a cron job service (like Vercel Cron, GitHub Actions, etc.)
// to send daily news emails to all users who have enabled notifications

async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify cron job secret (for security)
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real application, you would:
    // 1. Query your database for all users with dailyNewsEmail enabled
    // 2. Get their portfolio data
    // 3. Send emails to each user
    
    // For now, we'll simulate this process
    const users = await getUsersWithDailyNewsEnabled();
    
    const results = [];
    
    for (const user of users) {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/portfolio-news`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET}`,
          },
          body: JSON.stringify({
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
            portfolio: user.portfolio
          }),
        });

        const result = await response.json();
        results.push({
          userId: user.id,
          email: user.email,
          success: result.success,
          message: result.message || result.error
        });
      } catch (error) {
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Daily news emails processed for ${users.length} users`,
      results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Daily news cron job error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Mock function to get users with daily news enabled
// In a real app, this would query your database
async function getUsersWithDailyNewsEnabled() {
  // This is a mock implementation
  // In production, you would query your database for users with dailyNewsEmail: true
  
  const mockUsers = [
    {
      id: 'user1',
      email: 'test@example.com',
      name: 'Test User',
      portfolio: [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' }
      ]
    }
  ];

  return mockUsers;
}

export const POST = withSecurity(handler); 