// app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET() {
  try {
    const services = await query<any[]>(
      'SELECT id, name, description, price, duration, category, is_active as isActive FROM services WHERE is_active = TRUE ORDER BY order_index'
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