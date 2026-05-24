// app/api/admin/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { sendEmail, getAppointmentEmailTemplate, getAdminNotificationTemplate } from '@/app/lib/email';

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
    let paramIndex = 1;

    if (status) {
      sql += ` AND a.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (doctorId) {
      sql += ` AND a.doctor_id = $${paramIndex}`;
      params.push(doctorId);
      paramIndex++;
    }

    if (dateFrom) {
      sql += ` AND a.appointment_date >= $${paramIndex}`;
      params.push(dateFrom);
      paramIndex++;
    }

    if (dateTo) {
      sql += ` AND a.appointment_date <= $${paramIndex}`;
      params.push(dateTo);
      paramIndex++;
    }

    sql += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const appointments = await query<any[]>(sql, params);
    
    console.log('Admin appointments found:', appointments.length);
    
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении записей: ' + String(error) },
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

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Не указан ID записи или статус' },
        { status: 400 }
      );
    }

    // Получаем информацию о записи ДО обновления
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

    console.log(`Status changed for appointment #${appointmentId}: ${apt.status} -> ${status}`);

    // ========== ОТПРАВКА УВЕДОМЛЕНИЙ ==========

    // 1. Письмо пациенту
    if (apt.patient_email) {
      const subjectMap: Record<string, string> = {
        confirmed: '✅ Ваша запись подтверждена',
        cancelled: '❌ Запись отменена',
        completed: '✓ Прием завершен',
        pending: '🔄 Статус записи обновлен',
      };

      sendEmail(
        apt.patient_email,
        `${subjectMap[status] || 'Статус записи обновлен'} - Клиника Паллуа`,
        getAppointmentEmailTemplate({
          patientName: apt.patient_name,
          doctorName: apt.doctor_name || 'Не указан',
          serviceName: apt.service_name || undefined,
          date: apt.appointment_date,
          time: apt.appointment_time,
          status
        })
      ).then(sent => {
        if (sent) {
          console.log(`[EMAIL] Status update sent to patient: ${apt.patient_email}`);
        } else {
          console.error(`[EMAIL] Failed to send status update to patient: ${apt.patient_email}`);
        }
      }).catch(e => console.error('[EMAIL] Error sending to patient:', e));
    } else {
      console.log('[EMAIL] Patient email not provided, skipping notification');
    }

    // 2. Уведомление админу
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const statusText: Record<string, string> = {
        pending: 'Ожидает',
        confirmed: 'Подтверждена',
        cancelled: 'Отменена',
        completed: 'Завершена',
      };

      sendEmail(
        adminEmail,
        `Статус записи изменен: ${apt.patient_name}`,
        getAdminNotificationTemplate({
          type: 'status_change',
          details: {
            'Пациент': apt.patient_name,
            'Телефон': apt.patient_phone || 'Не указан',
            'Email': apt.patient_email || 'Не указан',
            'Врач': apt.doctor_name || 'Не указан',
            'Дата': apt.appointment_date,
            'Время': apt.appointment_time,
            'Предыдущий статус': statusText[apt.status] || apt.status,
            'Новый статус': statusText[status] || status,
            'Изменено': new Date().toLocaleString('ru-RU'),
          }
        })
      ).then(sent => {
        if (sent) {
          console.log(`[EMAIL] Admin notified about status change`);
        }
      }).catch(e => console.error('[EMAIL] Error sending to admin:', e));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении записи: ' + String(error) },
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

    // Получаем информацию перед удалением
    const appointment = await query<any[]>(
      'SELECT * FROM appointments WHERE id = $1',
      [id]
    );

    if (appointment.length === 0) {
      return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 });
    }

    const apt = appointment[0];

    await query('DELETE FROM appointments WHERE id = $1', [id]);

    console.log(`Appointment #${id} deleted`);

    // Отправляем уведомление пациенту
    if (apt.patient_email) {
      sendEmail(
        apt.patient_email,
        '❌ Запись удалена - Клиника Паллуа',
        getAppointmentEmailTemplate({
          patientName: apt.patient_name,
          doctorName: 'Не указан',
          date: apt.appointment_date,
          time: apt.appointment_time,
          status: 'cancelled'
        })
      ).catch(e => console.error('[EMAIL] Error:', e));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении записи: ' + String(error) },
      { status: 500 }
    );
  }
}