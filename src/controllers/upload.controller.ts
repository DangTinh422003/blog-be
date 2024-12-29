import { type NextFunction, type Request, type Response } from 'express';

import { BadRequestError } from '@/core/error.response';
import { UploadService } from '@/services/upload.service';

const uploadService = new UploadService();

export default class UploadController {
  async uploadThumbnail(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      throw new BadRequestError('File not found');
    }

    const file: Express.Multer.File = req.file;
    res.send(await uploadService.uploadFromLocal(file));
  }
}
