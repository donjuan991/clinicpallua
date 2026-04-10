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
  
  // Для INSERT с RETURNING
  if (result.rows && result.rows.length > 0) {
    return result.rows as T;
  }
  
  // Для SELECT
  if (result.rows) {
    return result.rows as T;
  }
  
  return [] as T;
}