import { type Request } from 'express';
import { type PaginateOptions, Types } from 'mongoose';
import { z } from 'zod';

import { BadRequestError, NotFoundError } from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import postModel, { type Post } from '@/models/post.model';
import PostRepository from '@/repository/post.repo';

export type OptionQuery = {
  page: number;
  limit: number;
  order: 'asc' | 'desc';
};

export class PostService {
  async findAllPost(req: Request) {
    const optionQuerySchema = z.object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).optional(),
      order: z.enum(['asc', 'desc']).optional(),
    });

    const optionQuery = optionQuerySchema.safeParse(req.query);

    if (optionQuery.error) {
      throw new BadRequestError('Invalid query');
    }

    const options: PaginateOptions = {
      page: optionQuery.data.page,
      limit: optionQuery.data.limit,
      sort: { createdAt: optionQuery.data.order || 'desc' },
      populate: {
        path: 'author',
        select: '-password',
      },
    };

    const posts = await postModel.paginate({}, options);
    return new OkResponse('Successfully!', { posts });
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

  async updatePost({
    postId,
    content,
    thumbnail,
    title,
  }: {
    postId: string;
    thumbnail: string;
    title: string;
    content: string;
  }) {
    const postHolder = await PostRepository.findById(postId);

    if (!postHolder) {
      throw new NotFoundError('Post not found');
    }

    const post = await postModel
      .findByIdAndUpdate(new Types.ObjectId(postId), { thumbnail, title, content }, { new: true })
      .populate('author', '-password')
      .lean();

    return new OkResponse('Successfully!', { post });
  }

  async createPost(post: Partial<Post>) {
    const _post = await PostRepository.createPost(post);
    return new CreatedResponse('Successfully!', { post: _post });
  }

  async findPost(postId: string) {
    const post = await postModel
      .findById(new Types.ObjectId(postId))
      .populate('author', '-password')
      .lean();

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return new OkResponse('Successfully!', {
      post,
    });
  }
}
