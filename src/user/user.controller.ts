import { Controller, Get, Req } from '@nestjs/common';
import { UserAccessPayload } from './user.types';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  accessProfile(@Req() req: Request) {
    const user = req['user'] as UserAccessPayload;
    return this.userService.accessProfile(user);
  }
}
