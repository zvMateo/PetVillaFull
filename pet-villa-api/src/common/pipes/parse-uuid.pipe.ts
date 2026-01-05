/**
 * Parse UUID Pipe
 * Validates and transforms UUID strings
 */

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) {
      throw new BadRequestException(`${metadata.data} should not be empty`);
    }

    if (!isUUID(value, '4')) {
      throw new BadRequestException(
        `${metadata.data} should be a valid UUID v4`,
      );
    }

    return value;
  }
}
