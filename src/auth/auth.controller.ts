import { Body, Controller, Delete, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto, RefreshAccessTokenDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh-access-token')
  refreshAccessToken(@Body() dto: RefreshAccessTokenDto) {
    return this.authService.refreshAccessToken(dto);
  }

  @Delete('logout')
  logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto);
  }
}
