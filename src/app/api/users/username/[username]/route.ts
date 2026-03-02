import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';

// GET /api/users/username/[username] - Get user by username
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Basic validation
    if (!username || username.length > 30) {
      return NextResponse.json(
        { error: 'Invalid username' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        coverImage: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error, 'Fetch user by username', 500);
  }
}
