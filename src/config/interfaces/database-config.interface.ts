export interface DatabaseConfig {
  type: 'sqlite' | 'mysql' | 'postgres' | 'mariadb' | 'better-sqlite3';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: any[];
  synchronize: boolean;
  autoLoadEntities: boolean;
}
