import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';

import { BadRequestError } from '@/core/error.response';

export default class AccessValidation {
  signUp(req: Request, res: Response, next: NextFunction) {
    const signUpSchema = z.object({
      email: z.string().email().min(1, 'Email is required'),
    });

    const check = signUpSchema.safeParse({ email: req.body.email });
    if (check.error) {
      throw new BadRequestError('Invalid email');
    }

    next();
  }

  signIn(req: Request, res: Response, next: NextFunction) {
    const signInSchema = z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(1, 'Password is required')
        .max(100, 'Password is too long'),
    });

    const check = signInSchema.safeParse({
      email: req.body.email,
      password: req.body.password,
    });

    if (check.error) {
      throw new BadRequestError('Invalid email or password');
    }

    next();
  }

  signOut(req: Request, res: Response, next: NextFunction) {
    const verifyOtpSchema = z.object({
      accessToken: z.string(),
    });

    const check = verifyOtpSchema.safeParse({
      accessToken: req.cookies.accessToken,
    });

    if (check.error) {
      throw new BadRequestError('Invalid token');
    }

    next();
  }

  verifySignUpToken(req: Request, res: Response, next: NextFunction) {
    const verifyOtpSchema = z.object({
      token: z.string().min(1, 'Token is required'),
    });

    const check = verifyOtpSchema.safeParse({ token: req.body.token });

    if (check.error) {
      throw new BadRequestError('Invalid token');
    }

    next();
  }

  refressToken(req: Request, res: Response, next: NextFunction) {
    const refreshTokenSchema = z.object({
      refressToken: z.string().min(1, 'Refress Token is required'),
    });

    const check = refreshTokenSchema.safeParse({
      refressToken: req.cookies.refreshToken,
    });

    if (check.error) {
      throw new BadRequestError('Invalid token');
    }

    next();
  }

  resetPassword(req: Request, res: Response, next: NextFunction) {
    const signUpSchema = z.object({
      email: z.string().email().min(1, 'Email is required'),
    });

    const check = signUpSchema.safeParse({ email: req.body.email });
    if (check.error) {
      throw new BadRequestError('Invalid email');
    }

    next();
  }
}
