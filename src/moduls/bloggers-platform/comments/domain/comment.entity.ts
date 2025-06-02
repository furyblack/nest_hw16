import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeletionStatus } from '../../../user-accounts/domain/user.entity';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ type: Object, required: true })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({
    type: Object,
    default: { likesCount: 0, dislikesCount: 0, myStatus: 'None' },
  })
  likesInfo: { likesCount: number; dislikesCount: number; myStatus: string };

  @Prop({ enum: DeletionStatus, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createInstance(
    this: CommentModelType,
    content: string,
    postId: string,
    userId: string,
    userLogin: string,
  ): CommentDocument {
    const comment = new this();
    comment.content = content;
    comment.postId = postId;
    comment.commentatorInfo = { userId, userLogin };
    comment.likesInfo = { likesCount: 0, dislikesCount: 0, myStatus: 'None' };
    return comment as CommentDocument;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.loadClass(Comment);
export interface CommentDocument extends HydratedDocument<Comment> {
  createdAt: Date;
}

export type CommentModelType = Model<CommentDocument> & typeof Comment;
