#!/usr/bin/env tsx

/**
 * Create Default Admin User Script
 * 
 * Creates a default admin user with credentials from environment variables
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { eq } from 'drizzle-orm';
import { user } from '../lib/db/schema';
import { generateHashedPassword } from '../lib/db/utils';

// Load environment variables
config({ path: '.env.local' });

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@localhost';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  
  console.log('=== Creating Default Admin User ===\n');
  
  try {
    // Set up database connection
    const dbPath = process.env.DATABASE_URL || './data/database.db';
    const dbDir = dirname(dbPath);
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }
    
    const sqlite = new Database(dbPath);
    const db = drizzle(sqlite);
    
    // Check if user already exists
    const existingUsers = await db.select().from(user).where(eq(user.email, email));
    if (existingUsers.length > 0) {
      console.log(`✅ Admin user already exists: ${email}`);
      console.log('No action needed.');
      sqlite.close();
      return;
    }
    
    // Create the admin user
    console.log(`Creating admin user: ${email}`);
    const hashedPassword = generateHashedPassword(password);
    
    await db.insert(user).values({
      id: crypto.randomUUID(),
      email: email,
      password: hashedPassword,
    });
    
    console.log(`✅ Admin user created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\n📝 These credentials are also stored in your .env.local file');
    
    sqlite.close();
    
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser().catch(console.error);
