// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

// Получить все записи (для админа или свои для пациента)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();  // ← ДОБАВЛЕН await
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
         WHERE a.user_id = ? OR a.patient_phone IN (
           SELECT phone FROM users WHERE id = ?
         )
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [userId, userId]
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

    // Проверка, что слот свободен
    const existing = await query<any[]>(
      `SELECT id FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? 
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
    const cookieStore = await cookies();  // ← ДОБАВЛЕН await
    const token = cookieStore.get('auth_token')?.value;
    let userId: number | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
      } catch (e) {}
    }

    // Создаем запись
    const result = await query<any>(
      `INSERT INTO appointments 
       (user_id, patient_name, patient_phone, patient_email, doctor_id, service_id, appointment_date, appointment_time, comment, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    return NextResponse.json({
      success: true,
      appointmentId: result.insertId,
      message: 'Запись успешно создана! Мы свяжемся с вами для подтверждения.'
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании записи' },
      { status: 500 }
    );
  }
}