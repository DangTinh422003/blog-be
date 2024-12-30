import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';

export const IMAGE_BASE_URL: string = process.env.IMAGE_BASE_URL || '';

const s3Confiug: S3ClientConfig = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY!,
  },
};

const s3Client = new S3Client(s3Confiug);

export default s3Client;
