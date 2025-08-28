import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  lastId: number = 1;

  @ApiProperty({ required: false, default: 10, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  take?: number = 10;
}

export class PaginationDtoBase {
  @ApiProperty({ description: 'Whether this is the last page' })
  isLastPage: boolean;

  @ApiProperty({ description: 'The current page number' })
  page: number;

  @ApiProperty({ description: 'The total number of pages' })
  limit: number;
}

/**
 * Creates a pagination response DTO class with properly typed content array.
 * This factory function generates a class that extends PaginationDtoBase and adds
 * a strongly-typed content array property for the specified model type.
 *
 * @template TModel - The model class type to be used for the content array items
 * @param model - The model class to be used for the content property
 * @returns A new class that represents the pagination response DTO with typed content
 *
 */
export function PaginationDtoResEnhanced<
  TModel extends new (...args: any[]) => any,
>(model: TModel) {
  const uniqueClassName = `${model.name}PaginationResponse`;

  class PaginationResponse extends PaginationDtoBase {
    @ApiProperty({
      description: 'The content array containing the paginated items',
      type: model,
      isArray: true,
    })
    @Type(() => model)
    content: InstanceType<TModel>[];
  }

  // Set the class name for better debugging and OpenAPI docs (Note from Mouloud To Whoever is Reading this :this is what was Causing the stupid problem of swagger showing differnt documentaion each time)
  Object.defineProperty(PaginationResponse, 'name', {
    value: uniqueClassName,
  });

  return PaginationResponse;
}

// left here until migration
export class PaginationDtoRes<T> {
  @ApiProperty({
    description: 'The content of the page with the data you need',
    type: () => [Object],
  })
  data: Array<T>;
  @ApiProperty({ description: 'Whether this is the last page' })
  hasMore: boolean;
  @ApiProperty({ description: 'The current page number' })
  take: number;
  @ApiProperty({ description: 'The total number of pages' })
  lastId: number;

  constructor(data: T[], take: number, lastId: number, hasMore: boolean) {
    this.data = data;
    this.hasMore = hasMore;
    this.lastId = lastId;
    this.take = take;
  }
}
