import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPostSchema, validateInput } from '@/lib/validation';
import { handleApiError } from '@/lib/api-error';
import { postsCache } from '@/lib/api-cache';

const POSTS_CACHE_TTL = 30_000; // 30 seconds

// GET /api/posts - List posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor');

    const cacheKey = `posts:${limit}:${cursor ?? 'none'}`;
    const cached = postsCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const posts = await prisma.post.findMany({
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: parseInt(cursor),
        },
      }),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    postsCache.set(cacheKey, posts, POSTS_CACHE_TTL);
    return NextResponse.json(posts);
  } catch (error) {
    return handleApiError(error, 'Fetch posts', 500);
  }
}

// POST /api/posts - Create post
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
    const validation = validateInput(createPostSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { title, content, image, parentId } = validation.data;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: image || null,
        parentId: parentId || null,
        userId,
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

    // Invalidate posts feed cache so new post appears
    postsCache.invalidateByPrefix('posts:');

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Create post', 500);
  }
}
