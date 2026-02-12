'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Set access token in httpOnly cookie
export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour (matches JWT expiry)
    path: '/',
  });
}

// Set refresh token in httpOnly cookie (secure, not accessible from JS)
export async function setRefreshToken(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

// Get refresh token from httpOnly cookie
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value;
}

// Clear refresh token cookie
export async function clearRefreshToken() {
  const cookieStore = await cookies();
  cookieStore.delete('refresh_token');
}

// Legacy support for old token system (to be removed)
export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function logout() {
  await clearAuthToken();
  await clearRefreshToken();
  redirect('/login');
}
