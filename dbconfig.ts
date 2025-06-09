import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const pgConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false },
  autoLoadEntities: true,
  synchronize: true,
};
