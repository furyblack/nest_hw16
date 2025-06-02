import { BaseSortablePaginationParams } from '../../../../core/dto/base.query-params.input-dto';

export enum PostsSortBy {
  CreatedAt = 'createdAt',
}

export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
  sortBy = PostsSortBy.CreatedAt;
  searchTitleTerm: string | null = null;
}
