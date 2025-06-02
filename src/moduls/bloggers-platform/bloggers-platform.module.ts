import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { Post, PostSchema } from './posts/domain/post.entity';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryRepository } from './posts/infrastructure/posts.query-repository';
import { PostsRepository } from './posts/infrastructure/posts-repository';
import { PostsController } from './posts/api/posts.controller';
import { PostLike, PostLikeSchema } from './posts/likes/like-model';
import { BlogIsExistConstraint } from './blogs/decorators/blog-is-existing';
import {
  CommentLikeModel,
  CommentLikeSchema,
} from './comments/likes/likes-model-for-comments';
import { Comment, CommentSchema } from './comments/domain/comment.entity';
import { CommentsService } from './comments/application/comments.service';
import { CommentsRepository } from './comments/infrastructure/comments-repository';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { CommentsController } from './comments/api/comments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: CommentLikeModel.name, schema: CommentLikeSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsQueryRepository,
    BlogsRepository,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    BlogIsExistConstraint,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
  ],
  exports: [MongooseModule],
})
export class BloggersPlatformModule {}
