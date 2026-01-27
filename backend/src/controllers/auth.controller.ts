import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Base validation schema (password validation is dynamic based on settings)
const baseRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(), // Min length validated dynamically
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['STUDENT', 'ADMIN']).optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Generate JWT token with dynamic session timeout from settings
const generateToken = async (userId: string, role: string): Promise<string> => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';

  // Fetch session timeout from platform settings
  try {
    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'singleton' },
      select: { sessionTimeout: true }
    });
    const days = settings?.sessionTimeout || 7;
    return jwt.sign(
      { userId, role },
      secret,
      { expiresIn: `${days}d` } as jwt.SignOptions
    );
  } catch (error) {
    // Fallback to default 7 days if settings fetch fails
    return jwt.sign(
      { userId, role },
      secret,
      { expiresIn: '7d' } as jwt.SignOptions
    );
  }
};

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    // Fetch minPasswordLength from platform settings
    let minPasswordLength = 6; // Default
    try {
      const settings = await prisma.platformSettings.findUnique({
        where: { id: 'singleton' },
        select: { minPasswordLength: true }
      });
      if (settings?.minPasswordLength) {
        minPasswordLength = settings.minPasswordLength;
      }
    } catch (err) {
      console.error('Failed to fetch password settings, using default:', err);
    }

    // Create dynamic schema with the correct password length
    const registerSchema = baseRegisterSchema.extend({
      password: z.string().min(minPasswordLength, `Password must be at least ${minPasswordLength} characters`)
    });

    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role || 'STUDENT'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    // Generate token (now async)
    const token = await generateToken(user.id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Fetch maxLoginAttempts from platform settings
    let maxLoginAttempts = 5; // Default
    try {
      const settings = await prisma.platformSettings.findUnique({
        where: { id: 'singleton' },
        select: { maxLoginAttempts: true }
      });
      if (settings?.maxLoginAttempts) {
        maxLoginAttempts = settings.maxLoginAttempts;
      }
    } catch (err) {
      console.error('Failed to fetch login attempt settings, using default:', err);
    }

    // Check if account is locked
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / 60000);
      return res.status(423).json({
        error: `Account is locked due to too many failed login attempts. Please try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`,
        lockedUntil: user.accountLockedUntil
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      // Increment login attempts
      const newAttempts = user.loginAttempts + 1;
      const updateData: any = {
        loginAttempts: newAttempts,
        lastFailedLogin: new Date()
      };

      // Lock account if max attempts reached (15 minute lockout)
      if (newAttempts >= maxLoginAttempts) {
        updateData.accountLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });

      // Send appropriate error message
      if (newAttempts >= maxLoginAttempts) {
        return res.status(423).json({
          error: 'Account locked due to too many failed login attempts. Please try again in 15 minutes.',
          lockedUntil: updateData.accountLockedUntil
        });
      } else {
        const attemptsLeft = maxLoginAttempts - newAttempts;
        return res.status(401).json({
          error: `Invalid email or password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining before account lockout.`
        });
      }
    }

    // Successful login - reset login attempts and clear lockout
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        loginAttempts: 0,
        lastFailedLogin: null,
        accountLockedUntil: null
      }
    });

    // Generate token (now async)
    const token = await generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Get current user info
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
};
