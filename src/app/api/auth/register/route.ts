import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { registerSchema, validateInput } from '@/lib/validation';
import { handleApiError } from '@/lib/api-error';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validation = validateInput(registerSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { email, username, name, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        coverImage: true,
        createdAt: true,
      },
    });

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return NextResponse.json({
      user,
      accessToken,
      refreshToken,
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Registration', 500);
  }
}
