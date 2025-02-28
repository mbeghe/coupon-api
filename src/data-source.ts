import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'your_db_user',
  password: process.env.DB_PASSWORD || 'your_db_password',
  database: process.env.DB_NAME || 'coupons-service',
  entities: [join(__dirname, "entities",'**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, "migrations",'**', '*.{ts,js}')],
  synchronize: false,
  logging: true
});
