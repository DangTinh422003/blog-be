import { type InferSchemaType, model, Schema } from 'mongoose';

import { DOCUMENT_NAME as POST_DOCUMENT_NAME } from '@/models/post.model';
import { DOCUMENT_NAME as USER_DOCUMENT_NAME } from '@/models/user.model';

export const DOCUMENT_NAME = 'Comment';
export const COLLECTION_NAME = 'Comments';

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: POST_DOCUMENT_NAME,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
    },
    content: {
      type: String,
      default: '',
    },
    left: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export type Comment = InferSchemaType<typeof commentSchema>;
const commentModel = model<Comment>(DOCUMENT_NAME, commentSchema);
export default commentModel;
