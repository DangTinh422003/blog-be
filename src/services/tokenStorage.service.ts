import tokenStorageModel from '@/models/tokenStorage.model';

export default class TokenStorageService {
  async createTokenStorage(userId: string, refreshToken: string) {
    const tokenStorage = await tokenStorageModel.findOneAndUpdate(
      {
        user: userId,
      },
      {
        refreshToken,
        refreshTokensUsed: [],
      },
      {
        upsert: true,
        new: true,
      },
    );

    return tokenStorage;
  }

  async deleteTokenStorage(userId: string) {
    return await tokenStorageModel.deleteOne({ user: userId });
  }

  async findByRefreshToken(refreshToken: string) {
    return await tokenStorageModel.findOne({ refreshToken });
  }

  async findByRefreshTokenUsed(refreshToken: string) {
    return await tokenStorageModel.findOne({
      refreshTokensUsed: refreshToken,
    });
  }
}
