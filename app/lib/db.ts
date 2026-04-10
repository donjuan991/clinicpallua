// app/lib/db.ts
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const db = getDb();
  const result = await db.query(sql, params);
  return result.rows as T;
}