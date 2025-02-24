// import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

// export const pgConfig : PostgresConnectionOptions ={
//     type: "postgres",
//     url: process.env.DATABASE_URL || "",
//     port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
//     entities:[],
//     synchronize: true
// }

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường từ file .env

export const pgConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432, 
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || 'postgres',
  ssl: { rejectUnauthorized: false }, // Bắt buộc khi kết nối đến Neon.tech
  autoLoadEntities: true,
  synchronize: true,
//   entities: [__dirname+'/**/*.entitiy{.ts,.js}']
};
