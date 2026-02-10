'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
  redirect('/login');
}
