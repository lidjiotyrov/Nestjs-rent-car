import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from "../../constans";

const dbProvider = {
  provide: PG_CONNECTION,
  useValue: new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DB for test task',
    password: 'admin',
    port: 5433,
  }),
};

@Module({
  controllers: [],
  providers: [dbProvider],
  exports: [dbProvider]
})
export class PgPromiseModule {}