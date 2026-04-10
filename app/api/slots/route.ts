// app/api/slots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    if (!doctorId || !date) {
      return NextResponse.json(
        { error: 'Необходимо указать doctorId и date' },
        { status: 400 }
      );
    }

    // Получаем расписание врача на этот день недели
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 0-6, где 0 - воскресенье

    const schedule = await query<any[]>(
      `SELECT start_time, end_time FROM schedules 
       WHERE doctor_id = ? AND day_of_week = ? AND is_working_day = TRUE`,
      [doctorId, dayOfWeek]
    );

    if (schedule.length === 0) {
      return NextResponse.json({ slots: [] });
    }

    // Проверяем, не является ли день исключением (отпуск, больничный)
    const exception = await query<any[]>(
      `SELECT * FROM schedule_exceptions 
       WHERE doctor_id = ? AND exception_date = ? AND is_working = FALSE`,
      [doctorId, date]
    );

    if (exception.length > 0) {
      return NextResponse.json({ slots: [] });
    }

    // Получаем уже занятые слоты
    const booked = await query<any[]>(
      `SELECT appointment_time FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND status NOT IN ('cancelled')`,
      [doctorId, date]
    );

    const bookedTimes = new Set(booked.map(b => b.appointment_time));

    // Генерируем доступные слоты (каждые 30 минут)
    const startTime = schedule[0].start_time;
    const endTime = schedule[0].end_time;
    const slots: string[] = [];

    let current = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);

    while (current < end) {
      const timeStr = current.toTimeString().slice(0, 5);
      if (!bookedTimes.has(timeStr)) {
        slots.push(timeStr);
      }
      current.setMinutes(current.getMinutes() + 30);
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Get slots error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении свободных слотов' },
      { status: 500 }
    );
  }
}