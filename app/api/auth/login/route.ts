// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'pallua_clinic_secret_key_2025';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt for:', email);

    // Поиск пользователя - ВАЖНО: используем $1 вместо ?
    const users = await query<any[]>(
      'SELECT id, email, password_hash, name, phone, role FROM users WHERE email = $1',
      [email]
    );

    console.log('Users found:', users.length);

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Проверка пароля
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Установка cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка при входе: ' + String(error) },
      { status: 500 }
    );
  }
}