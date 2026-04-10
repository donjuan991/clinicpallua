// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
      } catch (e) {}
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

    console.log('Creating appointment:', { patientName, patientPhone, doctorId, appointmentDate, appointmentTime });

    // Проверка, что слот свободен
    const existing = await query<any[]>(
      `SELECT id FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3 
       AND status NOT IN ('cancelled')`,
      [doctorId, appointmentDate, appointmentTime]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Это время уже занято' },
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
      } catch (e) {}
    }

    // Создаем запись (PostgreSQL синтаксис)
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

    console.log('Appointment created with id:', result[0].id);

    return NextResponse.json({
      success: true,
      appointmentId: result[0].id,
      message: 'Запись успешно создана! Мы свяжемся с вами для подтверждения.'
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании записи: ' + String(error) },
      { status: 500 }
    );
  }
}