// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();  // ← добавляем await
  cookieStore.delete('auth_token');     // ← теперь delete работает
  return NextResponse.json({ success: true });
}