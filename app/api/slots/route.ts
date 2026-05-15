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
    const dayOfWeek = dateObj.getDay(); // 0 = воскресенье, 1 = понедельник, ... 6 = суббота
    
    // В PostgreSQL день недели: 1-7 (пн-вс), поэтому конвертируем
    const pgDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    console.log('Day of week:', dayOfWeek, 'PG day:', pgDayOfWeek);

    // 1. Проверяем исключения (отпуск, больничный)
    const exception = await query<any[]>(
      `SELECT * FROM schedule_exceptions 
       WHERE doctor_id = $1 AND exception_date = $2`,
      [doctorId, date]
    );

    console.log('Exception found:', exception);

    // Если есть исключение и врач не работает - возвращаем пустой массив
    if (exception.length > 0 && exception[0].is_working === false) {
      console.log('Doctor is not working on this date (exception)');
      return NextResponse.json({ 
        slots: [],
        message: 'Врач не работает в этот день (отпуск/больничный)' 
      });
    }

    // 2. Получаем расписание врача на этот день
    const schedule = await query<any[]>(
      `SELECT start_time, end_time, is_working_day FROM schedules 
       WHERE doctor_id = $1 AND day_of_week = $2`,
      [doctorId, pgDayOfWeek]
    );

    console.log('Schedule found:', schedule);

    // Если нет расписания или день не рабочий - возвращаем пустой массив
    if (schedule.length === 0 || !schedule[0].is_working_day) {
      console.log('No schedule or not a working day');
      return NextResponse.json({ 
        slots: [],
        message: 'Врач не работает в этот день' 
      });
    }

    // 3. Проверяем, что выбранная дата не в прошлом
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      console.log('Date is in the past');
      return NextResponse.json({ 
        slots: [],
        message: 'Нельзя записаться на прошедшую дату' 
      });
    }

    // 4. Получаем уже занятые слоты
    const booked = await query<any[]>(
      `SELECT appointment_time FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND status NOT IN ('cancelled')`,
      [doctorId, date]
    );

    const bookedTimes = new Set(booked.map(b => b.appointment_time.substring(0, 5)));
    console.log('Booked times:', [...bookedTimes]);

    // 5. Генерируем доступные слоты (каждые 30 минут)
    const startTime = schedule[0].start_time;
    const endTime = schedule[0].end_time;
    const slots: string[] = [];

    // Парсим время начала и конца
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    // Создаем слоты с интервалом 30 минут
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Проверяем, что слот не в прошлом (для сегодняшней даты)
      if (selectedDate.getTime() === today.getTime()) {
        const now = new Date();
        const slotTime = new Date(date);
        slotTime.setHours(currentHour, currentMinute, 0, 0);
        
        if (slotTime > now && !bookedTimes.has(timeStr)) {
          slots.push(timeStr);
        }
      } else {
        // Для будущих дат просто проверяем занятость
        if (!bookedTimes.has(timeStr)) {
          slots.push(timeStr);
        }
      }
      
      // Увеличиваем на 30 минут
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour++;
        currentMinute -= 60;
      }
    }

    console.log('Available slots:', slots);

    return NextResponse.json({ 
      slots,
      workingHours: {
        start: startTime,
        end: endTime
      }
    });
  } catch (error) {
    console.error('Get slots error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении свободных слотов: ' + String(error) },
      { status: 500 }
    );
  }
}