// app/api/admin/schedule/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pallua_clinic_secret_key_2025';

async function isAdmin() {
  const cookieStore = await cookies();
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

    // Получаем расписание (все дни, включая нерабочие)
    const schedule = await query<any[]>(
      'SELECT * FROM schedules WHERE doctor_id = $1 ORDER BY day_of_week',
      [doctorId]
    );

    // Получаем исключения
    const exceptions = await query<any[]>(
      'SELECT * FROM schedule_exceptions WHERE doctor_id = $1 ORDER BY exception_date DESC LIMIT 30',
      [doctorId]
    );

    console.log('Schedule for doctor', doctorId, ':', JSON.stringify(schedule));
    console.log('Exceptions:', JSON.stringify(exceptions));

    return NextResponse.json({ schedule, exceptions });
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении расписания: ' + String(error) },
      { status: 500 }
    );
  }
}

// Обновить расписание (сохраняет все дни - и рабочие, и нерабочие)
export async function POST(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { doctorId, schedule } = body;

    console.log('Saving schedule - doctorId:', doctorId);
    console.log('Saving schedule - data:', JSON.stringify(schedule));

    if (!doctorId || !schedule || !Array.isArray(schedule)) {
      return NextResponse.json({ error: 'Необходимые данные не указаны' }, { status: 400 });
    }

    // Удаляем старое расписание для этого врача
    await query('DELETE FROM schedules WHERE doctor_id = $1', [doctorId]);
    console.log('Old schedule deleted for doctor:', doctorId);

    // Добавляем новое расписание (все дни, даже нерабочие)
    for (const slot of schedule) {
      console.log('Processing slot:', slot);
      
      await query(
        `INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time, is_working_day)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          doctorId, 
          slot.dayOfWeek, 
          slot.startTime || '09:00', 
          slot.endTime || '18:00', 
          slot.isWorkingDay === true
        ]
      );
    }

    console.log('Schedule saved successfully for doctor:', doctorId);
    return NextResponse.json({ success: true, message: 'Расписание сохранено' });
  } catch (error) {
    console.error('Update schedule error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении расписания: ' + String(error) },
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

    console.log('Adding exception:', { doctorId, exceptionDate, isWorking, reason });

    if (!doctorId || !exceptionDate) {
      return NextResponse.json({ error: 'Необходимые данные не указаны' }, { status: 400 });
    }

    // Используем ON CONFLICT для обновления, если запись уже существует
    await query(
      `INSERT INTO schedule_exceptions (doctor_id, exception_date, is_working, reason)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (doctor_id, exception_date) 
       DO UPDATE SET is_working = $3, reason = $4`,
      [doctorId, exceptionDate, isWorking === true, reason || 'other']
    );

    console.log('Exception added successfully');
    return NextResponse.json({ success: true, message: 'Исключение добавлено' });
  } catch (error) {
    console.error('Add exception error:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении исключения: ' + String(error) },
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

    console.log('Deleting exception:', id);
    await query('DELETE FROM schedule_exceptions WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'Исключение удалено' });
  } catch (error) {
    console.error('Delete exception error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении исключения: ' + String(error) },
      { status: 500 }
    );
  }
}