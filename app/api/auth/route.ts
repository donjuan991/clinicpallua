// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

// Регистрация
export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    // Проверка существования пользователя
    const existingUsers = await query<any[]>(
      'SELECT id FROM users WHERE email = ?',
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

    // Создание пользователя
    const result = await query<any>(
      'INSERT INTO users (email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone || null, 'patient']
    );

    // Создание JWT токена
    const token = jwt.sign(
      { id: result.insertId, email, role: 'patient' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Установка cookie - ДОБАВЛЕН await
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
      user: { id: result.insertId, email, name, role: 'patient' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
}