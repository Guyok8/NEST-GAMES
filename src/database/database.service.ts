// Pool is the “connection manager” to Postgres

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool!: Pool;

  onModuleInit() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  // query() lets other parts of app run SQL
  query(sql: string, params: any[] = []) {
    return this.pool.query(sql, params);
  }
}
