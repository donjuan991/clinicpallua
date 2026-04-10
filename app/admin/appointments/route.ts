// app/api/admin/appointments/route.ts
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

// Получить все записи с фильтрацией
export async function GET(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const doctorId = searchParams.get('doctorId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    let sql = `
      SELECT a.*, 
             d.name as doctor_name, 
             s.name as service_name,
             u.name as user_name,
             u.email as user_email
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (doctorId) {
      sql += ' AND a.doctor_id = ?';
      params.push(doctorId);
    }

    if (dateFrom) {
      sql += ' AND a.appointment_date >= ?';
      params.push(dateFrom);
    }

    if (dateTo) {
      sql += ' AND a.appointment_date <= ?';
      params.push(dateTo);
    }

    sql += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const appointments = await query<any[]>(sql, params);

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении записей' },
      { status: 500 }
    );
  }
}

// Обновить статус записи
export async function PUT(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { appointmentId, status } = body;

    await query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, appointmentId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении записи' },
      { status: 500 }
    );
  }
}

// Удалить запись
export async function DELETE(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID записи не указан' }, { status: 400 });
    }

    await query('DELETE FROM appointments WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении записи' },
      { status: 500 }
    );
  }
}