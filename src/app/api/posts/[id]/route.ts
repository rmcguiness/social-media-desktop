import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        comments: {
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
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return handleApiError(error, 'Fetch post', 500);
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
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

    // Verify post exists and belongs to user
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    if (post.userId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this post' },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Delete post', 500);
  }
}

// PATCH /api/posts/[id] - Update post
export async function PATCH(
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
    const body = await request.json();

    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Verify post exists and belongs to user
    const existingPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    if (existingPost.userId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this post' },
        { status: 403 }
      );
    }

    // Only allow updating specific fields
    const allowedFields = ['title', 'content', 'image'];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return handleApiError(error, 'Update post', 500);
  }
}
