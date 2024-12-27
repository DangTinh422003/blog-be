import express from 'express';

import PostController from '@/controllers/post.controller';
import { asyncHandler } from '@/middlewares/asyncHandler';
import { isAuthenticated } from '@/middlewares/isAuthenticated';
import { validationRequest } from '@/middlewares/validationRequest';
import postValidation from '@/validations/post.validation';

const router = express.Router();

const postController = new PostController();

router.use(isAuthenticated);

router.get('/find', asyncHandler(postController.findAllPost));

router.get(
  '/find/:id',
  validationRequest({ ...postValidation.findByIdSchema }),
  asyncHandler(postController.findById),
);

router.post(
  '/create',
  validationRequest({ ...postValidation.createPostSchema }),
  asyncHandler(postController.createPost),
);

router.delete(
  '/delete/:id',
  validationRequest({ ...postValidation.deletePostSchema }),
  asyncHandler(postController.deletePost),
);

router.patch(
  '/update',
  validationRequest({ ...postValidation.updatePostSchema }),
  asyncHandler(postController.updatePost),
);

export default router;
