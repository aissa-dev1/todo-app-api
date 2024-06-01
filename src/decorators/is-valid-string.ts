import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export function isValidString(field = 'Field') {
  return applyDecorators(
    IsString({ message: `${field} must be of type string` }),
    IsNotEmpty({ message: `${field} is required` }),
  );
}
