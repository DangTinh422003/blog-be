import { type NextFunction, type Request, type Response } from 'express';

import { PostService } from '@/services/post.controller';

const postService = new PostService();

export default class PostController {
  async findAllPost(req: Request, res: Response, next: NextFunction) {
    const queryOption = req.post?.validatedQuery || {};
    res.send(await postService.findAllPost(queryOption));
  }

  findById(req: Request, res: Response, next: NextFunction) {
    res.send('oke');
  }

  deletePost(req: Request, res: Response, next: NextFunction) {}

  updatePost(req: Request, res: Response, next: NextFunction) {}

  createPost(req: Request, res: Response, next: NextFunction) {}
}
