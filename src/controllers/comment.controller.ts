import { type NextFunction, type Request, type Response } from 'express';

import CommentService from '@/services/comment.service';

const commentService = new CommentService();

export default class CommentController {
  async createComment(req: Request, res: Response, next: NextFunction) {
    const { postId, userId, content, parentId } = req.body;

    res.send(
      await commentService.createComment({
        postId,
        userId,
        content,
        parentId,
      }),
    );
  }
}
