import { type NextFunction, type Request, type Response } from 'express';
import ms from 'ms';

import AccessService from '@/services/access.service';

const accessService = new AccessService();

export default class AccessController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    const email: string = req.body.email;
    res.send(await accessService.signUp(email));
  }

  async verifySignUpToken(req: Request, res: Response, next: NextFunction) {
    const token: string = req.body.token;
    const verifyRes = await accessService.verifySignUpToken(token);

    const { accessToken, refreshToken } = verifyRes.data!.tokens;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.send({ ...verifyRes });
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const signInRes = await accessService.signIn(email, password);
    const { accessToken, refreshToken } = signInRes.data!.tokens;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.send({ ...signInRes });
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    const accessToken: string = req.cookies.accessToken;
    const signOutRes = await accessService.signOut(accessToken);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.send({ ...signOutRes });
  }

  async refressToken(req: Request, res: Response, next: NextFunction) {
    const refreshTokenReq: string = req.cookies.refreshToken;
    const refressTokenRes = await accessService.refressToken(refreshTokenReq);

    const { accessToken, refreshToken } = refressTokenRes.data!.tokens;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.send({ ...refressTokenRes });
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const email: string = req.body.email;
    res.send(await accessService.resetPassword(email));
  }

  async verifyResetPassword(req: Request, res: Response, next: NextFunction) {
    const token: string = req.body.token;
    res.send(await accessService.verifyResetPasswordToken(token));
  }
}
