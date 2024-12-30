import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// eslint-disable-next-line import/order
import crypto from 'crypto';

import s3Client, { IMAGE_BASE_URL } from '@/configs/s3.config';
import { InternalServerError } from '@/core/error.response';
import { CreatedResponse } from '@/core/success.response';

export class UploadService {
  async uploadFromLocal(file: Express.Multer.File) {
    try {
      const randomName = crypto.randomBytes(16).toString('hex');

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: randomName,
        Body: file.buffer,
        ContentType: 'image/jpeg',
      });

      const result = await s3Client.send(command);

      const getCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: randomName,
      });

      const presigned = await getSignedUrl(s3Client, getCommand, {
        expiresIn: 3600,
      });

      return new CreatedResponse('File uploaded successfully', {
        ...result,
        imageUrl: `${IMAGE_BASE_URL}/${randomName}`,
      });
    } catch (error) {
      throw new InternalServerError(
        'Something went wrong while uploading the file',
      );
    }
  }
}
