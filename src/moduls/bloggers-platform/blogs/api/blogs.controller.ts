import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDomainDto } from '../domain/dto/create-blog.domain.dto';
import { BlogsViewDto } from '../dto/view-dto/blogs.view-dto';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { UpdateBlogInputDto } from './input-dto/update-blog.input-dto';
import { CreatePostForBlogInputDto } from '../../posts/dto/posts.dto';
import { PostsViewDto } from '../../posts/dto/posts.view-dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/api/get.posts.query.params';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { CurrentUser } from '../../../user-accounts/decarators/user-decorators';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogQueryRepository: BlogsQueryRepository,
    private blogService: BlogsService,
    private postsService: PostsService,
    private postQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    return this.blogQueryRepository.getAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<BlogsViewDto> {
    return this.blogQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get(':id/posts')
  @UseGuards(JwtOptionalAuthGuard)
  async getPostsForBlog(
    @Param('id') blogId: string,
    @CurrentUser() userId: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.postQueryRepository.getAllPostsForBlog(blogId, query, userId);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() body: CreateBlogDomainDto): Promise<BlogsViewDto> {
    const blogId = await this.blogService.createBlog(body);
    return this.blogQueryRepository.getByIdOrNotFoundFail(blogId);
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  async createPostForBlog(
    @Param('id') blogId: string,
    @Body() body: CreatePostForBlogInputDto,
  ): Promise<PostsViewDto> {
    const postId = await this.postsService.createPostForBlog(blogId, body);
    return this.postQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.blogService.deleteBlog(id);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() body: UpdateBlogInputDto,
  ): Promise<BlogsViewDto> {
    const blogId = await this.blogService.updateBlog(id, body);
    return this.blogQueryRepository.getByIdOrNotFoundFail(blogId);
  }
}
