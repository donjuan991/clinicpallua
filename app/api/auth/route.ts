// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'pallua_clinic_secret_key_2025';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    console.log('Registration attempt:', { email, name, phone });

    // Проверка существования пользователя
    const existingUsers = await query<any[]>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    // Создание пользователя
    const result = await query<any>(
      'INSERT INTO users (email, password_hash, name, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, hashedPassword, name, phone || null, 'patient']
    );

    console.log('User created with id:', result[0].id);

    // Создание JWT токена
    const token = jwt.sign(
      { id: result[0].id, email, role: 'patient' },
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
      user: { id: result[0].id, email, name, role: 'patient' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации: ' + String(error) },
      { status: 500 }
    );
  }
}