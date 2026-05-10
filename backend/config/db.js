import pkg from 'pg';
import { configDotenv } from 'dotenv';

configDotenv();

const { Pool } = pkg;

class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      Database.instance = this;
    }
    return Database.instance;
  }

  query(text, params) {
    return this.pool.query(text, params);
  }

  connect() {
    return this.pool.connect();
  }
}

const db = new Database();

export default db;
