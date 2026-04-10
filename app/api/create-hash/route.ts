import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  return NextResponse.json({ 
    password: password,
    hash: hash,
    sql: `UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@clinic.ru';`
  });
}