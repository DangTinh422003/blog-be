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
};

export default postValidation;
