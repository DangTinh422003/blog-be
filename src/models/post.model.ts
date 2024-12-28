import {
  type InferSchemaType,
  model,
  type PaginateModel,
  Schema,
  type UpdateQuery,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import slugify from 'slugify';

import { DOCUMENT_NAME as USER_DOCUMENT_NAME } from '@/models/user.model';

export const DOCUMENT_NAME = 'Post';
export const COLLECTION_NAME = 'Posts';

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    thumbnail: {
      type: String,
      default: '',
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      trim: true,
    });
  }
  next();
});

postSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as UpdateQuery<{ title?: string; $set?: { title?: string } }>;

  const title: string = update?.title || update?.$set?.title;
  if (title) {
    if (update.$set) {
      update.$set.slug = slugify(title, {
        lower: true,
        trim: true,
      });
    } else {
      update.slug = slugify(title, {
        lower: true,
        trim: true,
      });
    }
  }
  next();
});

postSchema.plugin(mongoosePaginate);

export type Post = InferSchemaType<typeof postSchema>;
const postModel = model<Post, PaginateModel<Post>>(DOCUMENT_NAME, postSchema);
export default postModel;
