import express from 'express';

import CommentController from '@/controllers/comment.controller';
import { asyncHandler } from '@/middlewares/asyncHandler';
import { isAuthenticated } from '@/middlewares/isAuthenticated';

const router = express.Router();

const commentController = new CommentController();

router.use(isAuthenticated);

router.post('/create', asyncHandler(commentController.createComment));

export default router;
