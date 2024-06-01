import { applyDecorators } from '@nestjs/common';
import { isValidString } from './is-valid-string';
import { Length } from 'class-validator';

export function IsPassword(field = 'Password') {
  return applyDecorators(
    isValidString(field),
    Length(4, 20, { message: `${field} must be 4-20 characters long` }),
  );
}
