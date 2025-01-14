import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { normalizeString } from '../helpers/wordsConverter';

@Injectable()
export class NormalizeTypePipe implements PipeTransform {
  transform(query: any, metadata: ArgumentMetadata) {
    if (typeof query !== 'object' || !query) {
      throw new BadRequestException('Invalid query parameters');
    }

    if (query.type) {
      query.type = normalizeString(query.country);
    }
    return query.type
  }
}
