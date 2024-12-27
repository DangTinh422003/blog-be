import { Types } from 'mongoose';

import postModel, { type Post } from '@/models/post.model';

export default class PostRepository {
  static async findById(postId: string) {
    return await postModel.findById(new Types.ObjectId(postId)).lean();
  }

  static async createPost(post: Partial<Post>) {
    return await postModel.create(post);
  }
}
