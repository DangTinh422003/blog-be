import userModel, { type User } from '@/models/user.model';

export class UserRepository {
  static async findByEmail(email: string) {
    return await userModel.findOne({ email }).lean();
  }

  static async updateById(userId: string, user: Partial<User>) {
    return await userModel.findByIdAndUpdate(userId, user);
  }
}
