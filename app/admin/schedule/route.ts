// app/api/admin/schedule/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

async function isAdmin() {
  const cookieStore = await cookies();  // ← добавляем await
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return false;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

// Получить расписание врача
export async function GET(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({ error: 'ID врача не указан' }, { status: 400 });
    }

    const schedule = await query<any[]>(
      'SELECT * FROM schedules WHERE doctor_id = ? ORDER BY day_of_week',
      [doctorId]
    );

    const exceptions = await query<any[]>(
      'SELECT * FROM schedule_exceptions WHERE doctor_id = ? ORDER BY exception_date DESC LIMIT 30',
      [doctorId]
    );

    return NextResponse.json({ schedule, exceptions });
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении расписания' },
      { status: 500 }
    );
  }
}

// Обновить расписание
export async function POST(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { doctorId, schedule } = body;

    // Удаляем старое расписание
    await query('DELETE FROM schedules WHERE doctor_id = ?', [doctorId]);

    // Добавляем новое
    for (const slot of schedule) {
      if (slot.isWorkingDay) {
        await query(
          `INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time, is_working_day)
           VALUES (?, ?, ?, ?, ?)`,
          [doctorId, slot.dayOfWeek, slot.startTime, slot.endTime, true]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update schedule error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении расписания' },
      { status: 500 }
    );
  }
}

// Добавить исключение (отпуск, больничный)
export async function PUT(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { doctorId, exceptionDate, isWorking, reason } = body;

    await query(
      `INSERT INTO schedule_exceptions (doctor_id, exception_date, is_working, reason)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE is_working = ?, reason = ?`,
      [doctorId, exceptionDate, isWorking, reason, isWorking, reason]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Add exception error:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении исключения' },
      { status: 500 }
    );
  }
}

// Удалить исключение
export async function DELETE(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID исключения не указан' }, { status: 400 });
    }

    await query('DELETE FROM schedule_exceptions WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete exception error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении исключения' },
      { status: 500 }
    );
  }
}