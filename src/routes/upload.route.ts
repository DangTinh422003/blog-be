import express from 'express';

import { uploadMemory } from '@/configs/multer.config';
import UploadController from '@/controllers/upload.controller';
import { asyncHandler } from '@/middlewares/asyncHandler';
import { isAuthenticated } from '@/middlewares/isAuthenticated';

const uploadController = new UploadController();

const router = express.Router();

router.use(isAuthenticated);

router.post(
  '/thumb',
  uploadMemory.single('file'),
  asyncHandler(uploadController.uploadThumbnail),
);

export default router;
