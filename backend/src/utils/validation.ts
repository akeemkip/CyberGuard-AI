import { z } from 'zod';

/**
 * Password validation schema with complexity requirements
 * Requires:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`)
 */
export const createPasswordSchema = (minLength: number = 8) => {
  return z
    .string()
    .min(minLength, `Password must be at least ${minLength} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/,
      'Password must contain at least one special character (!@#$%^&* etc.)'
    );
};

/**
 * Simple password schema with only length requirement (for backward compatibility)
 */
export const createSimplePasswordSchema = (minLength: number = 6) => {
  return z.string().min(minLength, `Password must be at least ${minLength} characters`);
};

/**
 * Validate password strength manually (for custom error messages)
 */
export const validatePasswordStrength = (password: string, minLength: number = 8): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
