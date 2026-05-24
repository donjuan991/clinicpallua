import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { sendEmail, getResetPasswordEmailTemplate } from '@/app/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'pallua_clinic_secret_key_2025';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email не указан' },
        { status: 400 }
      );
    }

    console.log('Forgot password request for:', email);

    // Проверяем существование пользователя
    const users = await query<any[]>(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email]
    );

    if (users.length === 0) {
      console.log('User not found for email:', email);
      // Не говорим, что пользователь не найден (безопасность)
      return NextResponse.json({
        success: true,
        message: 'Если пользователь с таким email существует, письмо отправлено'
      });
    }

    const user = users[0];

    // Создаем токен для сброса пароля (действует 1 час)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Формируем ссылку для сброса пароля
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const resetUrl = `${siteUrl}/reset-password?token=${resetToken}`;

    console.log('Sending reset password email to:', user.email);
    console.log('Reset URL:', resetUrl);

    // Отправляем письмо через Gmail
    const emailSent = await sendEmail(
      user.email,
      'Восстановление пароля - Клиника Паллуа',
      getResetPasswordEmailTemplate(user.name, resetUrl)
    );

    if (emailSent) {
      console.log('Reset password email sent successfully to:', user.email);
    } else {
      console.error('Failed to send reset password email to:', user.email);
    }

    return NextResponse.json({
      success: true,
      message: 'Если пользователь с таким email существует, письмо отправлено'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Ошибка при отправке письма: ' + String(error) },
      { status: 500 }
    );
  }
}