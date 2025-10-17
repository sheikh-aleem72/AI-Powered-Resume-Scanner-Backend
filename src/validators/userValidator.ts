import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 6 characters'),
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 6 characters'),
});

export type signupInput = z.infer<typeof signupSchema>;

export const requestOtpSchema = z.object({
  email: z.string().email(),
  username: z.string().optional(),
  password: z.string().min(6).optional(),
  purpose: z.enum(['signup', 'reset']),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  purpose: z.enum(['signup', 'reset']),
  newPassword: z.string().min(6).optional(), // for reset flow
});
