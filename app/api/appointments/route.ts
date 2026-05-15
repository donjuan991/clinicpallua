// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendEmail, getAppointmentEmailTemplate, getAdminNotificationTemplate } from '@/app/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'pallua_clinic_secret_key_2025';

// Получить все записи (для админа или свои для пациента)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    let userId: number | null = null;
    let userRole: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
        userRole = decoded.role;
      } catch (e) {
        // Токен невалидный - игнорируем
      }
    }

    let appointments;

    if (userRole === 'admin') {
      // Админ видит все записи
      appointments = await query<any[]>(
        `SELECT a.*, d.name as doctor_name, s.name as service_name 
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         LEFT JOIN services s ON a.service_id = s.id
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`
      );
    } else if (userId) {
      // Пациент видит только свои записи
      appointments = await query<any[]>(
        `SELECT a.*, d.name as doctor_name, s.name as service_name 
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         LEFT JOIN services s ON a.service_id = s.id
         WHERE a.user_id = $1 OR a.patient_phone IN (
           SELECT phone FROM users WHERE id = $1
         )
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [userId]
      );
    } else {
      return NextResponse.json({ appointments: [] });
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении записей' },
      { status: 500 }
    );
  }
}

// Создание записи
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientName,
      patientPhone,
      patientEmail,
      doctorId,
      serviceId,
      appointmentDate,
      appointmentTime,
      comment
    } = body;

    console.log('Creating appointment:', { 
      patientName, 
      patientPhone, 
      patientEmail,
      doctorId, 
      serviceId,
      appointmentDate, 
      appointmentTime 
    });

    // Проверка обязательных полей
    if (!patientName || !patientPhone || !doctorId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }

    // ========== ПРОВЕРКА РАСПИСАНИЯ ВРАЧА ==========
    
    // Получаем день недели
    const dateObj = new Date(appointmentDate);
    const dayOfWeek = dateObj.getDay(); // 0 = воскресенье, 1 = понедельник, ... 6 = суббота
    const pgDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    // 1. Проверяем исключения (отпуск, больничный)
    const exception = await query<any[]>(
      `SELECT * FROM schedule_exceptions 
       WHERE doctor_id = $1 AND exception_date = $2 AND is_working = FALSE`,
      [doctorId, appointmentDate]
    );

    if (exception.length > 0) {
      const reasonText = exception[0].reason === 'vacation' ? 'отпуск' : 
                         exception[0].reason === 'sick' ? 'больничный' : 'другая причина';
      return NextResponse.json(
        { error: `Врач не работает в выбранную дату (${reasonText}). Пожалуйста, выберите другую дату.` },
        { status: 400 }
      );
    }

    // 2. Проверяем расписание на этот день недели
    const schedule = await query<any[]>(
      `SELECT * FROM schedules 
       WHERE doctor_id = $1 AND day_of_week = $2 AND is_working_day = TRUE`,
      [doctorId, pgDayOfWeek]
    );

    if (schedule.length === 0) {
      const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
      return NextResponse.json(
        { error: `Врач не работает в выбранный день недели (${dayNames[dayOfWeek]}). Пожалуйста, выберите другой день.` },
        { status: 400 }
      );
    }

    // 3. Проверяем, что время входит в рабочее расписание
    const { start_time, end_time } = schedule[0];
    if (appointmentTime < start_time || appointmentTime >= end_time) {
      return NextResponse.json(
        { error: `Выбранное время не входит в рабочее расписание врача (${start_time} - ${end_time}).` },
        { status: 400 }
      );
    }

    // 4. Проверяем, что дата не в прошлом
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Нельзя записаться на прошедшую дату.' },
        { status: 400 }
      );
    }

    // 5. Проверяем, что выбранное время не в прошлом для сегодняшней даты
    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      const [hours, minutes] = appointmentTime.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      
      if (slotTime <= now) {
        return NextResponse.json(
          { error: 'Нельзя записаться на прошедшее время. Пожалуйста, выберите другое время.' },
          { status: 400 }
        );
      }
    }

    // ========== ПРОВЕРКА ЗАНЯТОСТИ СЛОТА ==========
    const existing = await query<any[]>(
      `SELECT id FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3 
       AND status NOT IN ('cancelled')`,
      [doctorId, appointmentDate, appointmentTime]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Это время уже занято. Пожалуйста, выберите другое время.' },
        { status: 400 }
      );
    }

    // Получаем текущего пользователя, если авторизован
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    let userId: number | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
      } catch (e) {
        // Токен невалидный - игнорируем
      }
    }

    // Создаем запись
    const result = await query<any>(
      `INSERT INTO appointments 
       (user_id, patient_name, patient_phone, patient_email, doctor_id, service_id, appointment_date, appointment_time, comment, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        userId,
        patientName,
        patientPhone,
        patientEmail || null,
        doctorId,
        serviceId || null,
        appointmentDate,
        appointmentTime,
        comment || null,
        'pending'
      ]
    );

    const appointmentId = result[0].id;
    console.log('Appointment created with id:', appointmentId);

    // Получаем информацию о враче и услуге для email
    let doctorName = 'Не указан';
    let serviceName: string | null = null;

    try {
      const doctorInfo = await query<any[]>(
        'SELECT name FROM doctors WHERE id = $1',
        [doctorId]
      );
      doctorName = doctorInfo[0]?.name || 'Не указан';
    } catch (e) {
      console.error('Error fetching doctor info:', e);
    }

    if (serviceId) {
      try {
        const serviceInfo = await query<any[]>(
          'SELECT name FROM services WHERE id = $1',
          [serviceId]
        );
        serviceName = serviceInfo[0]?.name || null;
      } catch (e) {
        console.error('Error fetching service info:', e);
      }
    }

    // Отправка email уведомлений (асинхронно)
    
    // 1. Письмо пациенту
    if (patientEmail) {
      sendEmail(
        patientEmail,
        'Ваша запись в Клинику Паллуа',
        getAppointmentEmailTemplate({
          patientName,
          doctorName,
          serviceName: serviceName || undefined,
          date: appointmentDate,
          time: appointmentTime,
          status: 'pending'
        })
      ).catch(e => console.error('Failed to send appointment email to patient:', e));
    }

    // 2. Уведомление администратору
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const details: Record<string, string> = {
        'Пациент': patientName,
        'Телефон': patientPhone,
        'Email': patientEmail || 'Не указан',
        'Врач': doctorName,
        'Дата': appointmentDate,
        'Время': appointmentTime,
      };
      
      if (serviceName) {
        details['Услуга'] = serviceName;
      }
      
      if (comment) {
        details['Комментарий'] = comment;
      }
      
      details['Статус'] = 'Ожидает подтверждения';

      sendEmail(
        adminEmail,
        `Новая запись: ${patientName} на ${appointmentDate} в ${appointmentTime}`,
        getAdminNotificationTemplate({
          type: 'new_appointment',
          details
        })
      ).catch(e => console.error('Failed to send admin notification:', e));
    }

    console.log('Appointment successfully created and emails queued');

    return NextResponse.json({
      success: true,
      appointmentId,
      message: 'Запись успешно создана! Мы свяжемся с вами для подтверждения.'
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    
    let errorMessage = 'Ошибка при создании записи';
    
    if (error instanceof Error) {
      if (error.message.includes('foreign key')) {
        errorMessage = 'Указанный врач или услуга не найдены';
      } else if (error.message.includes('duplicate key')) {
        errorMessage = 'Запись с такими данными уже существует';
      } else {
        errorMessage = `Ошибка: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Обновление статуса записи
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    let userRole: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userRole = decoded.role;
      } catch (e) {
        return NextResponse.json(
          { error: 'Необходима авторизация' },
          { status: 401 }
        );
      }
    }

    // Только админ может обновлять статус
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Не указан ID записи или статус' },
        { status: 400 }
      );
    }

    // Проверяем, что статус валидный
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Неверный статус' },
        { status: 400 }
      );
    }

    // Получаем информацию о записи до обновления
    const oldAppointment = await query<any[]>(
      `SELECT a.*, d.name as doctor_name, s.name as service_name 
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.id = $1`,
      [appointmentId]
    );

    if (oldAppointment.length === 0) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    // Обновляем статус
    await query(
      'UPDATE appointments SET status = $1 WHERE id = $2',
      [status, appointmentId]
    );

    const apt = oldAppointment[0];

    // Отправляем уведомление пациенту об изменении статуса
    if (apt.patient_email) {
      const emailSubject = 
        status === 'confirmed' ? '✅ Ваша запись подтверждена' :
        status === 'cancelled' ? '❌ Запись отменена' :
        status === 'completed' ? '✓ Прием завершен' :
        '🔄 Статус записи обновлен';

      sendEmail(
        apt.patient_email,
        `${emailSubject} - Клиника Паллуа`,
        getAppointmentEmailTemplate({
          patientName: apt.patient_name,
          doctorName: apt.doctor_name || 'Не указан',
          serviceName: apt.service_name || undefined,
          date: apt.appointment_date,
          time: apt.appointment_time,
          status
        })
      ).catch(e => console.error('Failed to send status update email:', e));
    }

    // Уведомление админу
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      sendEmail(
        adminEmail,
        `Статус записи изменен: ${apt.patient_name}`,
        getAdminNotificationTemplate({
          type: 'status_change',
          details: {
            'Пациент': apt.patient_name,
            'Врач': apt.doctor_name || 'Не указан',
            'Дата': apt.appointment_date,
            'Время': apt.appointment_time,
            'Новый статус': status,
            'Изменено': new Date().toLocaleString('ru-RU')
          }
        })
      ).catch(e => console.error('Failed to send admin status notification:', e));
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Статус записи обновлен' 
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении записи' },
      { status: 500 }
    );
  }
}