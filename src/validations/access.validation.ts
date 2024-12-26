import { z } from 'zod';

import { TOKEN } from '@/constants';

const accessValidation = {
  signUpSchema: {
    body: z.object({
      email: z.string().email().min(1, 'Missing Email'),
    }),
  },

  signInSchema: {
    body: z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(1, 'Password is required')
        .max(100, 'Password is too long, max 100 characters'),
    }),
  },

  signOutSchema: {
    cookies: z.object({
      [TOKEN.ACCESS_TOKEN]: z.string(),
    }),
  },

  verifySignUpTokenSchema: {
    body: z.object({
      [TOKEN.OTP_TOKEN]: z.string(),
    }),
  },

  refressTokenSchema: {
    cookies: z.object({
      [TOKEN.REFRESH_TOKEN]: z.string(),
    }),
  },

  resetPasswordSchema: {
    body: z.object({
      email: z.string().email().min(1, 'Email is required'),
    }),
  },

  changePasswordSchema: {
    body: z.object({
      email: z.string().email().min(1, 'Email is required'),
      newPassword: z.string().min(1, 'Password is required').max(100, 'Password is too long'),
    }),
    cookies: z.object({
      [TOKEN.ACCESS_TOKEN]: z.string(),
    }),
  },
};

export default accessValidation;
