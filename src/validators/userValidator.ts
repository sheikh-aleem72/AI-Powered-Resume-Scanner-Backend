import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 6 characters'),
});

export type signupSchema = z.infer<typeof signupSchema>;
