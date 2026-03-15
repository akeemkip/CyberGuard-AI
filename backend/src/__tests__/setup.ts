// Jest setup file
// This file runs before each test suite

import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root so DATABASE_URL is available
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.ENCRYPTION_KEY = 'test-encryption-key-64-chars-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
