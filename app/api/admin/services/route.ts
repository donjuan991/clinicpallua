// app/api/admin/services/route.ts
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

// Получить все услуги
export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const services = await query<any[]>(
      'SELECT * FROM services ORDER BY category, order_index'
    );
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка услуг' },
      { status: 500 }
    );
  }
}

// Создать услугу
export async function POST(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, price, duration, category, isActive, orderIndex } = body;

    const result = await query<any>(
      `INSERT INTO services (name, description, price, duration, category, is_active, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, description || null, price || null, duration || null, category, isActive !== false, orderIndex || 0]
    );

    return NextResponse.json({
      success: true,
      serviceId: result[0].id
    });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании услуги' },
      { status: 500 }
    );
  }
}

// Обновить услугу
export async function PUT(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, name, description, price, duration, category, isActive, orderIndex } = body;

    await query(
      `UPDATE services 
       SET name = $1, description = $2, price = $3, duration = $4, category = $5, is_active = $6, order_index = $7
       WHERE id = $8`,
      [name, description || null, price || null, duration || null, category, isActive !== false, orderIndex || 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении услуги' },
      { status: 500 }
    );
  }
}

// Удалить услугу
export async function DELETE(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID услуги не указан' }, { status: 400 });
    }

    await query('DELETE FROM services WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении услуги' },
      { status: 500 }
    );
  }
}