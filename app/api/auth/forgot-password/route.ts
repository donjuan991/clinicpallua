import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/app/lib/email';

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

    // Проверяем существование пользователя
    const users = await query<any[]>(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email]
    );

    if (users.length === 0) {
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
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Отправляем письмо
    const emailSent = await sendEmail(
      user.email,
      'Восстановление пароля - Клиника Паллуа',
      getResetPasswordEmailTemplate(user.name, resetUrl)
    );

    if (!emailSent) {
      console.error('Failed to send reset password email');
    }

    return NextResponse.json({
      success: true,
      message: 'Если пользователь с таким email существует, письмо отправлено'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Ошибка при отправке письма' },
      { status: 500 }
    );
  }
}

function getResetPasswordEmailTemplate(name: string, resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #771d55 0%, #9a366e 100%); padding: 30px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Восстановление пароля</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Клиника Паллуа</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #771d55; margin: 0 0 20px;">Здравствуйте, ${name}!</h2>
        
        <p style="color: #2d2d2d; line-height: 1.6; margin-bottom: 20px;">
          Вы запросили восстановление пароля для входа в личный кабинет Клиники Паллуа.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; background: linear-gradient(135deg, #771d55 0%, #9a366e 100%); 
                    color: white; padding: 14px 30px; border-radius: 12px; text-decoration: none; 
                    font-weight: 500; font-size: 16px; box-shadow: 0 4px 12px rgba(119, 29, 85, 0.3);">
            Сбросить пароль
          </a>
        </div>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 12px; margin-bottom: 25px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            ⚠️ Ссылка действительна в течение <strong>1 часа</strong>.<br>
            Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
          </p>
        </div>
        
        <hr style="margin: 30px 0 20px; border: none; border-top: 1px solid #e8e8e8;">
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          С уважением,<br>
          <strong>Клиника пластической хирургии "Паллуа"</strong><br>
          📞 <a href="tel:+79131489142" style="color: #771d55; text-decoration: none;">+7 (913) 148-91-42</a>
        </p>
      </div>
    </body>
    </html>
  `;
}