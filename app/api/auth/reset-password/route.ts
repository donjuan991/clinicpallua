import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pallua_clinic_secret_key_2025';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Токен и новый пароль обязательны' },
        { status: 400 }
      );
    }

    // Проверяем токен
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Ссылка недействительна или истек срок действия' },
        { status: 400 }
      );
    }

    // Проверяем, что это токен для сброса пароля
    if (decoded.type !== 'password_reset') {
      return NextResponse.json(
        { error: 'Неверный тип токена' },
        { status: 400 }
      );
    }

    // Проверяем, что пользователь существует
    const users = await query<any[]>(
      'SELECT id FROM users WHERE id = $1 AND email = $2',
      [decoded.id, decoded.email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль
    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, decoded.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Пароль успешно изменен'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Ошибка при смене пароля' },
      { status: 500 }
    );
  }
}