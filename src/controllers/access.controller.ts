import { type NextFunction, type Request, type Response } from 'express';
import ms from 'ms';

import { TOKEN } from '@/constants';
import AccessService from '@/services/access.service';

const accessService = new AccessService();

export default class AccessController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    const email: string = req.body.email;
    res.send(await accessService.signUp(email));
  }

  async verifySignUpToken(req: Request, res: Response, next: NextFunction) {
    const token: string = req.body[TOKEN.OTP_TOKEN];
    const verifyRes = await accessService.verifySignUpToken(token);
    const data = verifyRes!.data;
    const { accessToken, refreshToken } = data!.tokens;

    res.cookie(TOKEN.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.cookie(TOKEN.REFRESH_TOKEN, refreshToken, {
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

    res.cookie(TOKEN.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.cookie(TOKEN.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.send({ ...signInRes });
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    const accessToken: string = req.cookies[TOKEN.ACCESS_TOKEN];
    const signOutRes = await accessService.signOut(accessToken);

    res.clearCookie(TOKEN.ACCESS_TOKEN);
    res.clearCookie(TOKEN.REFRESH_TOKEN);

    res.send({ ...signOutRes });
  }

  async refressToken(req: Request, res: Response, next: NextFunction) {
    const refreshTokenReq: string = req.cookies[TOKEN.REFRESH_TOKEN];
    const refressTokenRes = await accessService.refressToken(refreshTokenReq);

    const { accessToken, refreshToken } = refressTokenRes.data!.tokens;

    res.cookie(TOKEN.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days'),
    });

    res.cookie(TOKEN.REFRESH_TOKEN, refreshToken, {
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
    const token: string = req.body[TOKEN.OTP_TOKEN];
    res.send(await accessService.verifyResetPasswordToken(token));
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const email: string = req.body.email;
    const newPassword: string = req.body.newPassword;
    res.send(await accessService.changePassword(email, newPassword));
  }
}
