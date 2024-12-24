import JWT, {
  type JwtPayload,
  type PrivateKey,
  type Secret,
} from 'jsonwebtoken';

export default class TokenService {
  generateToken(
    payload: JwtPayload,
    privateKey: Secret | PrivateKey,
    expiresIn: string,
  ) {
    return JWT.sign(payload, privateKey, { expiresIn, algorithm: 'HS256' });
  }

  verifyToken(token: string, privateKey: Secret | JWT.PublicKey) {
    return JWT.verify(token, privateKey) as JwtPayload;
  }

  async generateTokens(payload: JwtPayload) {
    const accessTokenExpiresIn = '3h';
    const refreshTokenExpiresIn = '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY!,
        accessTokenExpiresIn,
      ),
      this.generateToken(
        payload,
        process.env.REFRESH_TOKEN_PRIVATE_KEY!,
        refreshTokenExpiresIn,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
