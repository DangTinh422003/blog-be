import userModel from '@/models/user.model';

export class UserRepository {
  static async findByEmail(email: string) {
    return await userModel.findOne({ email }).lean();
  }
}
