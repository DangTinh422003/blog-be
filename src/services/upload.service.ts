import { PutObjectCommand } from '@aws-sdk/client-s3';
// eslint-disable-next-line import/order
import crypto from 'crypto';

import s3Client from '@/configs/s3.config';
import { InternalServerError } from '@/core/error.response';
import { CreatedResponse } from '@/core/success.response';

export class UploadService {
  async uploadFromLocal(file: Express.Multer.File) {
    try {
      const randomName = crypto.randomBytes(16).toString('hex');

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${file.originalname}-${randomName}`,
        Body: file.buffer,
        ContentType: 'image/jpeg',
      });

      const result = await s3Client.send(command);

      return new CreatedResponse('File uploaded successfully', result);
    } catch (error) {
      throw new InternalServerError(
        'Something went wrong while uploading the file',
      );
    }
  }
}
