// app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'pallua_clinic_secret_key_2025';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ждем разрешения params (важно для Next.js 16)
    const { id } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    let userId: number | null = null;
    let userRole: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
        userRole = decoded.role;
      } catch (e) {}
    }

    const appointmentId = parseInt(id);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: 'Неверный ID записи' },
        { status: 400 }
      );
    }

    // Получаем информацию о записи
    const appointment = await query<any[]>(
      'SELECT user_id, status FROM appointments WHERE id = $1',
      [appointmentId]
    );

    if (appointment.length === 0) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    const apt = appointment[0];

    // Проверка прав: только админ или владелец записи
    if (userRole !== 'admin' && apt.user_id !== userId) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    // Отменяем запись (меняем статус, не удаляем)
    await query(
      'UPDATE appointments SET status = $1 WHERE id = $2',
      ['cancelled', appointmentId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json(
      { error: 'Ошибка при отмене записи: ' + String(error) },
      { status: 500 }
    );
  }
}