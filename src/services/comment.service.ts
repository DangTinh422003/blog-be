import { InternalServerError, NotFoundError } from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import commentModel, { type Comment } from '@/models/comment.model';

export default class CommentService {
  async createComment({
    postId,
    userId,
    content,
    parentId,
  }: Pick<Comment, 'postId' | 'content' | 'userId' | 'parentId'>) {
    const session = await commentModel.startSession();
    session.startTransaction();

    try {
      let left = 1;
      let right = 2;

      if (parentId) {
        const parent = await commentModel.findById(parentId).session(session);
        if (!parent) {
          throw new NotFoundError('Parent comment not found');
        }

        left = parent.right;
        right = left + 1;

        await commentModel.updateMany(
          { right: { $gte: left } },
          { $inc: { right: 2 } },
          { session },
        );

        await commentModel.updateMany(
          { left: { $gt: left } },
          { $inc: { left: 2 } },
          { session },
        );
      } else {
        const maxRightNode = await commentModel
          .findOne({
            postId,
          })
          .sort({ right: -1 })
          .session(session);

        if (maxRightNode) {
          left = maxRightNode.right + 1;
          right = left + 1;
        }
      }

      const newComment = await commentModel.create(
        [
          {
            content,
            userId,
            postId,
            parentId,
            left,
            right,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      await session.endSession();

      return new CreatedResponse('Comment created successfully', {
        comment: newComment,
      });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerError('Failed to create comment');
    }
  }

  async getCommentByParentid({
    postId,
    parentCommentId,
  }: {
    postId: string;
    parentCommentId: string;
  }) {
    if (parentCommentId) {
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment)
        throw new NotFoundError(`comment ${parentCommentId} not found`);

      const comments = await commentModel
        .find({
          postId,
          left: { $gt: parentComment.left },
          right: { $lt: parentComment.right },
        })
        .sort({ left: 1 });

      return comments;
    } else {
      const comments = await commentModel
        .find({
          postId,
          parentId: parentCommentId,
        })
        .sort({ left: 1 });

      return comments;
    }
  }

  async deleteComment(commentId: string) {
    const session = await commentModel.startSession();
    session.startTransaction();

    try {
      const comment = await commentModel.findById(commentId).session(session);
      if (!comment) {
        throw new NotFoundError('Comment not found');
      }

      const { left, right } = comment;
      const width = right - left + 1;

      await commentModel.deleteMany(
        { left: { $gte: left }, right: { $lte: right } },
        { session },
      );

      await commentModel.updateMany(
        { right: { $gt: right } },
        { $inc: { right: -width } },
        { session },
      );

      await commentModel.updateMany(
        { left: { $gt: right } },
        { $inc: { left: -width } },
        { session },
      );

      await session.commitTransaction();
      await session.endSession();

      return new OkResponse('Comment deleted successfully');
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerError('Failed to delete comment');
    }
  }
}
