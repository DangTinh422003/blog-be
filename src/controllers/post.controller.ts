import { type NextFunction, type Request, type Response } from 'express';

import { PostService } from '@/services/post.controller';

const postService = new PostService();

export default class PostController {
  async findAllPost(req: Request, res: Response, next: NextFunction) {
    res.send(await postService.findAllPost(req));
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const postId: string = req.params.id;

    res.send(await postService.findPost(postId));
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const postId: string = req.params.id;
    const userId: string = req.jwtDecoded._id;

    res.send(await postService.deletePost(userId, postId));
  }

  updatePost(req: Request, res: Response, next: NextFunction) {
    res.send('oke');
  }

  createPost(req: Request, res: Response, next: NextFunction) {
    res.send('oke');
  }
}
