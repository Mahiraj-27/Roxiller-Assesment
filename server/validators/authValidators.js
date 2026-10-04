const { z } = require('zod');

// ── Shared Validation Primitives ─────────────────────────────────────────────
const nameSchema = z
  .string({ required_error: 'Full name is required' })
  .trim()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters');

const emailSchema = z
  .string({ required_error: 'Email address is required' })
  .trim()
  .email('Invalid email address format');

const addressSchema = z
  .string({ required_error: 'Address is required' })
  .trim()
  .max(400, 'Address must not exceed 400 characters');

const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .max(16, 'Password must not exceed 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const ratingSchema = z
  .number({ required_error: 'Rating score is required' })
  .int('Rating score must be an integer')
  .min(1, 'Rating score must be between 1 and 5')
  .max(5, 'Rating score must be between 1 and 5');

const roleSchema = z.enum(['admin', 'user', 'store_owner'], {
  errorMap: () => ({ message: 'Role must be admin, user, or store_owner' }),
});

// ── Composed Payload Schemas ────────────────────────────────────────────────
const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Current password is required' }).min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: roleSchema,
});

const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.number().int().positive().optional().nullable(),
});

const submitRatingSchema = z.object({
  rating: ratingSchema,
});

module.exports = {
  nameSchema,
  emailSchema,
  addressSchema,
  passwordSchema,
  ratingSchema,
  roleSchema,
  signupSchema,
  loginSchema,
  changePasswordSchema,
  createUserSchema,
  createStoreSchema,
  submitRatingSchema,
};
