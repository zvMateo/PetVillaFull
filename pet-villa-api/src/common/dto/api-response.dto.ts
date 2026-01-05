/**
 * Standardized API Response DTO
 * Ensures consistent response format across all endpoints
 */

import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseMetaDto {
  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({
    description: 'Pagination metadata (for paginated responses)',
    required: false,
  })
  meta?: ApiResponseMetaDto;

  @ApiProperty({ description: 'Response message', required: false })
  message?: string;
}

export class ApiErrorDto {
  @ApiProperty({ description: 'Success status' })
  success: false;

  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'Error details', required: false })
  errors?: Record<string, string[]>;

  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;
}
