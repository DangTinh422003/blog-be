import express from 'express';

import PostController from '@/controllers/post.controller';
import { asyncHandler } from '@/middlewares/asyncHandler';
import { isAuthenticated } from '@/middlewares/isAuthenticated';
import PostValidation from '@/validations/post.validation';

const router = express.Router();

const postController = new PostController();
const postValidation = new PostValidation();

router.use(isAuthenticated);

router.get(
  '/find',
  asyncHandler(postValidation.findAllPost),
  asyncHandler(postController.findAllPost),
);
router.get(
  '/find/:id',
  asyncHandler(postValidation.findById),
  asyncHandler(postController.findById),
);
router.get('/create', asyncHandler(postController.createPost));
router.delete('/delete/:id', asyncHandler(postController.deletePost));
router.patch('/update', asyncHandler(postController.updatePost));

export default router;
