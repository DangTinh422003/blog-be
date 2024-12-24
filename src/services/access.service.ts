import bcrypt from 'bcrypt';
import { type JwtPayload } from 'jsonwebtoken';
import type Mail from 'nodemailer/lib/mailer';

import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import otpModel from '@/models/otp.model';
import userModel from '@/models/user.model';
import { UserRepository } from '@/repository/user.repo';
import EmailService from '@/services/email.service';
import TokenService from '@/services/token.service';
import TokenStorageService from '@/services/tokenStorage.service';
import welcomeTemplate from '@/templates/welcome.template';
import { isValidEmail } from '@/utils/isValidEmail.util';
import { removePasswordField } from '@/utils/removePasswordField.util';

const tokenService = new TokenService();
const emailService = new EmailService();
const tokenStorageService = new TokenStorageService();

export default class AccessService {
  async signUp(email: string) {
    const [userHolder, otpHolder] = await Promise.all([
      userModel.findOne({ email }).lean(),
      otpModel.findOne({ email }).lean(),
    ]);

    if (userHolder || otpHolder) {
      throw new BadRequestError('Email already exists');
    }

    const tokenVerify = tokenService.generateToken(
      { email },
      process.env.SIGN_UP_TOKEN_PRIVATE_KEY!,
      '60s',
    );

    await otpModel.create({
      email,
      otp: tokenVerify,
    });

    const replacedEmailTemplate = emailService.replacedEmailTemplate(
      welcomeTemplate(),
      [
        {
          key: '{{email}}',
          value: email,
        },
        {
          key: '{{token}}',
          value: tokenVerify,
        },
      ],
    );

    try {
      const transporter = emailService.initTransporter('smtp.gmail.com', {
        user: process.env.EMAIL_SERVICE_AUTH_USER!,
        pass: process.env.EMAIL_SERVICE_AUTH_PASS!,
      });

      const mailOptions: Mail.Options = {
        from: {
          name: 'Dev Blog',
          address: process.env.EMAIL_SERVICE_AUTH_USER!,
        },
        to: email,
        subject: 'Welcome to DevBlog, Please verify your email',
        html: replacedEmailTemplate,
      };

      await emailService.sendMail(transporter, mailOptions);

      return new OkResponse('Email sent successfully');
    } catch (error) {
      throw new InternalServerError();
    }
  }

  async verifySignUpToken(token: string) {
    const decoded: JwtPayload = tokenService.verifyToken(
      token,
      process.env.SIGN_UP_TOKEN_PRIVATE_KEY!,
    );

    const email: string = decoded.email;
    if (!email) throw new BadRequestError('Invalid token');

    const SALT = 10;
    const hashedPassword = await bcrypt.hash(email, SALT);

    const { password, ...newUser } = (
      await userModel.create({ email, password: hashedPassword })
    ).toObject();

    const { accessToken, refreshToken } =
      await tokenService.generateTokens(newUser);

    const tokenStorage = await tokenStorageService.createTokenStorage(
      newUser._id.toString(),
      refreshToken,
    );

    if (!tokenStorage) {
      throw new InternalServerError();
    }

    return new CreatedResponse('Created', {
      user: newUser,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  }

  async signIn(email: string, password: string) {
    const userFound = await UserRepository.findByEmail(email);

    if (!userFound) {
      throw new NotFoundError('User not found');
    }

    const isMatchPassword = await bcrypt.compare(password, userFound.password);
    if (!isMatchPassword) {
      throw new BadRequestError('Invalid password');
    }

    const user = removePasswordField(userFound);

    const { accessToken, refreshToken } =
      await tokenService.generateTokens(user);

    await tokenStorageService.createTokenStorage(
      user._id.toString(),
      refreshToken,
    );

    return new OkResponse('Login successfully', {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  }

  async signOut(accessToken: string) {
    const userDecoded = tokenService.verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY!,
    );

    const deletedTokenStorage = await tokenStorageService.deleteTokenStorage(
      userDecoded._id as string,
    );

    if (!deletedTokenStorage) {
      throw new NotFoundError('Token storage not found');
    }

    return new OkResponse('Logout successfully');
  }

  async refressToken(refreshToken: string) {
    const tokenStorage =
      await tokenStorageService.findByRefreshTokenUsed(refreshToken);

    if (tokenStorage) {
      const userDecoded = tokenService.verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_PRIVATE_KEY!,
      );

      await tokenStorageService.deleteTokenStorage(userDecoded._id as string);
      throw new ForbiddenError('Token has been used, please login again');
    }

    const tokenHolder =
      await tokenStorageService.findByRefreshToken(refreshToken);

    if (!tokenHolder) {
      throw new NotFoundError('Token not found');
    }

    const userDecoded = tokenService.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY!,
    );

    const email: string = userDecoded.email;

    if (!email || !isValidEmail(email)) {
      throw new BadRequestError('Invalid token');
    }

    const userFound = await UserRepository.findByEmail(email);

    if (!userFound) {
      throw new NotFoundError('User not found');
    }

    const user = removePasswordField(userFound);

    const tokens = await tokenService.generateTokens(user);

    await tokenHolder.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: { refreshTokensUsed: refreshToken },
    });

    return new OkResponse('Token refreshed', {
      user,
      tokens,
    });
  }

  async resetPassword(email: string) {
    const userHolder = await UserRepository.findByEmail(email);

    if (!userHolder) {
      throw new NotFoundError('User not found');
    }

    const tokenVerify = tokenService.generateToken(
      { email },
      process.env.RESET_PASSWORD_TOKEN_PRIVATE_KEY!,
      '60s',
    );

    await otpModel.create({
      email,
      otp: tokenVerify,
    });

    const replacedEmailTemplate = emailService.replacedEmailTemplate(
      welcomeTemplate(),
      [
        {
          key: '{{email}}',
          value: email,
        },
        {
          key: '{{token}}',
          value: tokenVerify,
        },
      ],
    );

    try {
      const transporter = emailService.initTransporter('smtp.gmail.com', {
        user: process.env.EMAIL_SERVICE_AUTH_USER!,
        pass: process.env.EMAIL_SERVICE_AUTH_PASS!,
      });

      const mailOptions: Mail.Options = {
        from: {
          name: 'Dev Blog',
          address: process.env.EMAIL_SERVICE_AUTH_USER!,
        },
        to: email,
        subject: 'Reset your password, Please verify your email',
        html: replacedEmailTemplate,
      };

      await emailService.sendMail(transporter, mailOptions);

      return new OkResponse('Email sent successfully');
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
