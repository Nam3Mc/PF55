import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { normalizeString } from '../helpers/wordsConverter';

@Injectable()
export class NormalizeCountryPipe implements PipeTransform {
  transform(query: any, metadata: ArgumentMetadata) {
    if (typeof query !== 'object' || !query) {
      throw new BadRequestException('Invalid query parameters');
    }

    if (query.country) {
      query.country = normalizeString(query.country);
    }
    return query.country
  }
}
