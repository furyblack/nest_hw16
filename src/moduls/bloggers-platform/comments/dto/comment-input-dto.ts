import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decarators/transform/trim';

export class CommentInputDto {
  @IsString()
  @Length(20, 300)
  @Trim()
  content: string;
}

export class UpdateCommentDto {
  @IsString()
  @Length(20, 300)
  @Trim()
  content: string;
}
