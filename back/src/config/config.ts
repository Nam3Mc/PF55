import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT ),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/**/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    dropSchema: true, 
    synchronize: true,
    ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false } : false
};


export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);