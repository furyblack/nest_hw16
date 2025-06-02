import { HttpStatus, INestApplication } from '@nestjs/common';
import { BlogsTestManager } from './blogs-test-manager';
import {
  CreatePostDto,
  UpdatePostDto,
} from '../../src/moduls/bloggers-platform/posts/dto/posts.dto';
import { PostsViewDto } from '../../src/moduls/bloggers-platform/posts/dto/posts.view-dto';
import request from 'supertest';
import { CreateBlogDto } from '../../src/moduls/bloggers-platform/blogs/dto/create-blog.dto';
import { delay } from './delay';

export class PostsTestManager {
  constructor(
    private app: INestApplication,
    private readonly blogTestManager: BlogsTestManager,
  ) {}

  async createPost(
    createModel: CreatePostDto,
    statusCode: number = HttpStatus.CREATED,
  ): Promise<PostsViewDto> {
    const response = await request(this.app.getHttpServer())
      .post('/api/posts')
      .send(createModel)
      .expect(statusCode);
    return response.body;
  }

  async createSeveralPosts(
    count: number,
    blogId?: string,
  ): Promise<PostsViewDto[]> {
    if (!blogId) {
      const blogBody: CreateBlogDto = {
        name: 'default',
        description: 'default description',
        websiteUrl: 'http://example.com',
      };

      const createdBlog = await this.blogTestManager.createBlog(blogBody);
      blogId = await createdBlog.id;
    }
    const postsPromises = [] as Promise<PostsViewDto>[];
    for (let i = 0; i < count; ++i) {
      await delay(50);
      const response = this.createPost({
        title: `Post ${i + 1}`,
        shortDescription: 'Short description',
        content: 'Content',
        blogId,
      });
      postsPromises.push(response);
    }
    // Ждем, пока все посты будут созданы
    return Promise.all(postsPromises);
  }

  async deletePost(postId: string): Promise<void> {
    const server = this.app.getHttpServer();
    await request(server).delete(`/api/posts/${postId}`).expect(204);
  }
  async updatePost(postId: string, updateBody: UpdatePostDto): Promise<void> {
    await request(this.app.getHttpServer())
      .put(`/api/posts/${postId}`)
      .send(updateBody)
      .expect(HttpStatus.NO_CONTENT);
  }
}
