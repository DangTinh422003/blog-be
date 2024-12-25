import express from 'express';

import PostController from '@/controllers/post.controller';
import { asyncHandler } from '@/middlewares/asyncHandler';
import { isAuthenticated } from '@/middlewares/isAuthenticated';

const router = express.Router();

const postController = new PostController();

router.use(isAuthenticated);

router.get('/find', asyncHandler(postController.findAllPost));
router.get('/find/:id', asyncHandler(postController.findById));
router.get('/create', asyncHandler(postController.createPost));
router.delete('/delete/:id', asyncHandler(postController.deletePost));
router.patch('/update', asyncHandler(postController.updatePost));

export default router;
