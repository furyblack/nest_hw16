import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateBlogDomainDto } from '../../src/moduls/bloggers-platform/blogs/domain/dto/create-blog.domain.dto';
import { BlogsViewDto } from '../../src/moduls/bloggers-platform/blogs/dto/view-dto/blogs.view-dto';
import request from 'supertest';
import { delay } from './delay';
import { UpdateBlogDto } from '../../src/moduls/bloggers-platform/blogs/dto/create-blog.dto';

export class BlogsTestManager {
  constructor(private app: INestApplication) {}
  async createBlog(
    createModel: CreateBlogDomainDto,
    statusCode: number = HttpStatus.CREATED,
  ): Promise<BlogsViewDto> {
    const response = await request(this.app.getHttpServer())
      .post('/api/blogs')
      .send(createModel)
      .auth('admin', 'qwerty')
      .expect(statusCode);
    return response.body;
  }

  async createSeveralBlogs(count: number): Promise<BlogsViewDto[]> {
    const blogsPromises = [] as Promise<BlogsViewDto>[];
    for (let i = 0; i < count; ++i) {
      await delay(50);
      const response = this.createBlog({
        name: 'string' + i,
        description: `string${i}`,

        websiteUrl:
          'https://p.7H1rV.DE-7hHrXZ9-ecNVheetttF66YKCJ_-gjJz1zDp0fQ6Yk1RCgUP00kPHQQ-ZuYOna0386PCmCt6VFpYShwgjX',
      });
      blogsPromises.push(response);
    }
    return Promise.all(blogsPromises);
  }
  async deleteBlog(blogId: string): Promise<void> {
    const server = this.app.getHttpServer();
    await request(server)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(204);
  }

  async updateBlog(blogId: string, updateBody: UpdateBlogDto): Promise<void> {
    await request(this.app.getHttpServer())
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(updateBody)
      .expect(HttpStatus.NO_CONTENT);
  }
}
