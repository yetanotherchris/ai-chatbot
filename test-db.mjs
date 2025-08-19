#!/usr/bin/env node

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { user } from './lib/db/schema.ts';

console.log('Testing SQLite database connection...');

try {
  const sqlite = new Database('./data/database.db');
  const db = drizzle(sqlite);

  // Test the connection by trying to select from user table
  const users = await db.select().from(user).limit(1);
  
  console.log('✅ Database connection successful!');
  console.log(`Database file exists and is accessible.`);
  console.log(`Users table query successful (found ${users.length} users).`);
  
  sqlite.close();
} catch (error) {
  console.error('❌ Database connection failed:');
  console.error(error);
  process.exit(1);
}
