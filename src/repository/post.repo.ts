import { Types } from 'mongoose';

import postModel from '@/models/post.model';

export default class PostRepository {
  static async findById(postId: string) {
    return await postModel.findById(new Types.ObjectId(postId)).lean();
  }
}
