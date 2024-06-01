import { IsEmail } from 'class-validator';
import { IsPassword } from 'src/decorators/is-password';
import { isValidString } from 'src/decorators/is-valid-string';

export class LoginDto {
  @IsEmail({}, { message: 'Please use a valid email' })
  email: string;

  @IsPassword()
  password: string;
}

export class RefreshAccessTokenDto {
  @isValidString('Token')
  token: string;
}

export class LogoutDto {
  @isValidString('Token')
  token: string;
}
