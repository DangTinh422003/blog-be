import { type PaginateOptions, Types } from 'mongoose';

import { BadRequestError, NotFoundError } from '@/core/error.response';
import { OkResponse } from '@/core/success.response';
import postModel from '@/models/post.model';
import PostRepository from '@/repository/post.repo';

type OptionQuery = {
  page: number;
  limit: number;
  order: 'asc' | 'desc';
};

export class PostService {
  async findAllPost({
    page = 1,
    limit = 20,
    order = 'asc',
  }: Partial<OptionQuery>) {
    const options: PaginateOptions = {
      page,
      limit,
      sort: { createdAt: order },
      populate: 'author',
    };

    const posts = await postModel.paginate({}, options);

    return new OkResponse('Successfully!', {
      posts,
    });
  }

  async deletePost(userId: string, postId: string) {
    const post = await PostRepository.findById(postId);
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    if (post.author.toString() !== userId) {
      throw new BadRequestError('Not The Owner');
    }

    await postModel.findByIdAndDelete(new Types.ObjectId(postId));

    return new OkResponse('Successfully!');
  }

  updatePost() {}

  createPost() {}

  async findPost(postId: string) {
    const post = await postModel
      .findById(new Types.ObjectId(postId))
      .populate('author')
      .lean();

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return new OkResponse('Successfully!', {
      post,
    });
  }
}
