import { IsEmail } from 'class-validator';
import { IsPassword } from 'src/decorators/is-password';
import { isValidString } from 'src/decorators/is-valid-string';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please use a valid email' })
  email: string;

  @IsPassword()
  password: string;

  @isValidString('UserName')
  userName: string;
}
