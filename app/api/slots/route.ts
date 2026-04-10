// app/api/slots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    console.log('Slots request:', { doctorId, date });

    if (!doctorId || !date) {
      return NextResponse.json(
        { error: 'Необходимо указать doctorId и date' },
        { status: 400 }
      );
    }

    // Получаем день недели (0-6, где 0 - воскресенье)
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    // В PostgreSQL день недели: 1-7 (пн-вс), поэтому конвертируем
    const pgDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    console.log('Day of week:', dayOfWeek, 'PG day:', pgDayOfWeek);

    // Получаем расписание врача на этот день
    const schedule = await query<any[]>(
      `SELECT start_time, end_time FROM schedules 
       WHERE doctor_id = $1 AND day_of_week = $2 AND is_working_day = TRUE`,
      [doctorId, pgDayOfWeek]
    );

    console.log('Schedule found:', schedule);

    if (schedule.length === 0) {
      return NextResponse.json({ slots: [] });
    }

    // Проверяем исключения (отпуск, больничный)
    const exception = await query<any[]>(
      `SELECT * FROM schedule_exceptions 
       WHERE doctor_id = $1 AND exception_date = $2 AND is_working = FALSE`,
      [doctorId, date]
    );

    if (exception.length > 0) {
      console.log('Exception found, no slots');
      return NextResponse.json({ slots: [] });
    }

    // Получаем уже занятые слоты
    const booked = await query<any[]>(
      `SELECT appointment_time FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND status NOT IN ('cancelled')`,
      [doctorId, date]
    );

    const bookedTimes = new Set(booked.map(b => b.appointment_time));
    console.log('Booked times:', [...bookedTimes]);

    // Генерируем доступные слоты (каждые 30 минут)
    const startTime = schedule[0].start_time;
    const endTime = schedule[0].end_time;
    const slots: string[] = [];

    let [startHour, startMinute] = startTime.split(':').map(Number);
    let [endHour, endMinute] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      if (!bookedTimes.has(timeStr)) {
        slots.push(timeStr);
      }
      
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour++;
        currentMinute -= 60;
      }
    }

    console.log('Available slots:', slots);

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Get slots error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении свободных слотов: ' + String(error) },
      { status: 500 }
    );
  }
}