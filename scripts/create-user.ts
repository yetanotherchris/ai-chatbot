#!/usr/bin/env tsx

/**
 * Manual User Creation Script
 * 
 * Since user registration is disabled in the application, this script allows
 * administrators to manually create user accounts.
 * 
 * Usage:
 *   npm run create-user
 * 
 * Or directly:
 *   npx tsx scripts/create-user.ts
 */

import { config } from 'dotenv';
import { createUser } from '../lib/db/queries';
import { createInterface } from 'readline';

// Load environment variables
config({ path: '.env.local' });

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('=== Manual User Creation ===\n');
  
  try {
    const email = await question('Enter email address: ');
    const password = await question('Enter password: ');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Error: Invalid email format');
      process.exit(1);
    }
    
    // Validate password length
    if (password.length < 6) {
      console.error('Error: Password must be at least 6 characters long');
      process.exit(1);
    }
    
    console.log('\nCreating user...');
    await createUser(email, password);
    console.log(`✅ User created successfully: ${email}`);
    
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
