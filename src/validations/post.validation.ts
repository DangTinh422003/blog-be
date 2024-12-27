import mongoose from 'mongoose';
import { z } from 'zod';

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const postValidation = {
  deletePostSchema: {
    params: z.object({
      id: z.string().refine(isValidObjectId, {
        message: 'Invalid ObjectId format',
      }),
    }),
  },

  findByIdSchema: {
    params: z.object({
      id: z.string().refine(isValidObjectId, {
        message: 'Invalid ObjectId format',
      }),
    }),
  },

  createPostSchema: {
    body: z.object({
      author: z.string().refine(isValidObjectId, {
        message: 'Invalid ObjectId format',
      }),
      thumbnail: z.string(),
      title: z.string().min(5),
      content: z.string().min(10),
    }),
  },

  updatePostSchema: {
    body: z.object({
      id: z.string().refine(isValidObjectId, {
        message: 'Invalid ObjectId format',
      }),
      title: z.string().min(5).optional(),
      content: z.string().min(10).optional(),
      thumbnail: z.string().optional(),
    }),
  },
};

export default postValidation;
