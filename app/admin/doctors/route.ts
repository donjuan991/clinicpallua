// app/api/admin/doctors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Проверка админ-прав
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

// Получить всех врачей
export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const doctors = await query<any[]>(
      'SELECT * FROM doctors ORDER BY order_index'
    );
    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка врачей' },
      { status: 500 }
    );
  }
}

// Создать врача
export async function POST(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, specialization, description, experience, rating, isActive, orderIndex } = body;

    const result = await query<any>(
      `INSERT INTO doctors (name, specialization, description, experience, rating, is_active, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, specialization, description, experience || null, rating || 0, isActive !== false, orderIndex || 0]
    );

    return NextResponse.json({
      success: true,
      doctorId: result.insertId
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании врача' },
      { status: 500 }
    );
  }
}

// Обновить врача
export async function PUT(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, name, specialization, description, experience, rating, isActive, orderIndex } = body;

    await query(
      `UPDATE doctors 
       SET name = ?, specialization = ?, description = ?, experience = ?, rating = ?, is_active = ?, order_index = ?
       WHERE id = ?`,
      [name, specialization, description, experience || null, rating || 0, isActive !== false, orderIndex || 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update doctor error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении врача' },
      { status: 500 }
    );
  }
}

// Удалить врача
export async function DELETE(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID врача не указан' }, { status: 400 });
    }

    // Проверяем, есть ли записи к этому врачу
    const appointments = await query<any[]>(
      'SELECT id FROM appointments WHERE doctor_id = ?',
      [id]
    );

    if (appointments.length > 0) {
      // Если есть записи, просто деактивируем
      await query('UPDATE doctors SET is_active = FALSE WHERE id = ?', [id]);
      return NextResponse.json({ 
        success: true, 
        message: 'Врач деактивирован (есть записи на прием)' 
      });
    }

    await query('DELETE FROM doctors WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete doctor error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении врача' },
      { status: 500 }
    );
  }
}