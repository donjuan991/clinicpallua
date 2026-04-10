// app/api/doctors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../lib/db';

export async function GET() {
  try {
    const doctors = await query<any[]>(
      'SELECT id, name, specialization, description, image_url as imageUrl, experience, rating, is_active as isActive FROM doctors WHERE is_active = TRUE ORDER BY order_index'
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