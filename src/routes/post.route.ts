import express from 'express';

import PostController from '@/controllers/post.controller';
import { isAuthenticated } from '@/middlewares/isAuthenticated';
import PostValidation from '@/validations/post.validation';

const router = express.Router();

const postController = new PostController();
const postValidation = new PostValidation();

router.use(isAuthenticated);

router.get('/find', postValidation.findAllPost, postController.findAllPost);
router.get('/find/:id', postValidation.findById, postController.findById);
router.get('/create', postController.createPost);
router.get('/delete', postController.deletePost);
router.get('/update', postController.updatePost);

export default router;
