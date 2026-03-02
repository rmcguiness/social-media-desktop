import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';

// POST /api/posts/[id]/like - Toggle like
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract and verify auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { verifyToken } = await import('@/lib/jwt');
    
    let userId: number;
    try {
      const payload = verifyToken(token);
      userId = payload.userId;
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return handleApiError(error, 'Toggle like', 500);
  }
}
