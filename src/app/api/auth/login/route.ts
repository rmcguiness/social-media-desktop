import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { loginSchema, validateInput } from '@/lib/validation';
import { handleApiError } from '@/lib/api-error';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validation = validateInput(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { emailOrUsername, password } = validation.data;

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        coverImage: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return handleApiError(error, 'Login', 500);
  }
}
