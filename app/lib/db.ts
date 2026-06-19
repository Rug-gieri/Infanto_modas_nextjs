import { Pool } from 'pg'

const pool = new Pool({
  host: 'db.yvcfeaystlsschdpdwvc.supabase.co',
  port: 6543,
  database: 'postgres',
  user: 'postgres',
  password: 'terminaressecurso',
  ssl: {
    rejectUnauthorized: false,
  },
})

export default pool