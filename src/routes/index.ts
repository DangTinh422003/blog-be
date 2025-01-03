import express from 'express';

import accessRouter from '@/routes/access.route';
import commentRouter from '@/routes/comment.route';
import postRouter from '@/routes/post.route';
import uploadRouter from '@/routes/upload.route';

const router = express.Router();

router.use('/access', accessRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/upload', uploadRouter);

export default router;
