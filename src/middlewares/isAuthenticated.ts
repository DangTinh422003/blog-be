import { type NextFunction, type Request, type Response } from 'express';
import { type JwtPayload } from 'jsonwebtoken';

import { GoneError, UnauthorizedError } from '@/core/error.response';
import { handleError } from '@/middlewares/handleError';
import { UserRepository } from '@/repository/user.repo';
import TokenService from '@/services/token.service';
import TokenStorageService from '@/services/tokenStorage.service';

const tokenService = new TokenService();
const tokenStorageService = new TokenStorageService();

export const isAuthenticated = handleError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken: string = req.cookies.accessToken;

      if (!accessToken) {
        throw new UnauthorizedError('Unauthorized');
      }

      const jwtDecoded: JwtPayload = tokenService.verifyToken(
        accessToken,
        process.env.ACCESS_TOKEN_PRIVATE_KEY!,
      );

      const userId: string = jwtDecoded._id;

      const [userHolder, tokenStorageHolder] = await Promise.all([
        UserRepository.findById(userId),
        tokenStorageService.findByUserId(userId),
      ]);

      if (!userHolder || !tokenStorageHolder) {
        throw new UnauthorizedError('Unauthorized');
      }

      Object.assign(req, { jwtDecoded });
      next();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('jwt expired')) {
          throw new GoneError('Token expired!');
        }

        throw new UnauthorizedError('Unauthorized');
      }
    }
  },
);
