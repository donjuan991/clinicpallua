// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'pallua_clinic_secret_key_2025';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const users = await query<any[]>(
      'SELECT id, email, name, phone, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (users.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ user: null });
  }
}