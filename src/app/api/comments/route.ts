import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCommentSchema, validateInput } from '@/lib/validation';
import { handleApiError } from '@/lib/api-error';

// GET /api/comments - List comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    const parsedPostId = parseInt(postId);
    if (isNaN(parsedPostId) || parsedPostId <= 0) {
      return NextResponse.json(
        { error: 'Invalid postId' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: parsedPostId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return handleApiError(error, 'Fetch comments', 500);
  }
}

// POST /api/comments - Create comment
export async function POST(request: NextRequest) {
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
    
    // Verify token and extract user ID
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

    const body = await request.json();
    
    // Validate input with Zod
    const validation = validateInput(createCommentSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { postId, content } = validation.data;

    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Create comment', 500);
  }
}
