import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';

// DELETE /api/comments/[id] - Delete comment
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
    const commentId = parseInt(id);

    if (isNaN(commentId) || commentId <= 0) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    // Verify comment exists and belongs to user
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    if (comment.userId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this comment' },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'Delete comment', 500);
  }
}

// PATCH /api/comments/[id] - Update comment
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
    const commentId = parseInt(id);
    const body = await request.json();

    if (isNaN(commentId) || commentId <= 0) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    // Verify comment exists and belongs to user
    const existingComment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    if (existingComment.userId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this comment' },
        { status: 403 }
      );
    }

    // Only allow updating content
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: body.content },
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

    return NextResponse.json(comment);
  } catch (error) {
    return handleApiError(error, 'Update comment', 500);
  }
}
