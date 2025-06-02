import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../domain/comment.entity';
import { Injectable } from '@nestjs/common';
import { DeletionStatus } from '../../../user-accounts/domain/user.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
  ) {}

  async save(comment: CommentDocument): Promise<void> {
    await comment.save();
  }
  async findById(id: string): Promise<CommentDocument | null> {
    return this.commentModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });
  }
}
