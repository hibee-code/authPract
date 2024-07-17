import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { pathFromSrc } from '../helpers/general';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME || 'utility_db',
  username: process.env.DB_USER || 'ibrahim',
  password: process.env.DB_PASSWORD || 'root',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  host: process.env.DB_HOST || 'localhost',
  entities: ['./src/**/*.entity.{js,ts}'],
  migrations: [pathFromSrc('config/migrations/**/*.{js,ts}')],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
console.log(dataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    console.log('Database connection established successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
