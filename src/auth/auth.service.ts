import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { UserAccessPayload } from 'src/user/user.types';
import { LoginDto, LogoutDto, RefreshAccessTokenDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshTokenEntity } from './auth.refresh-token.model';
import { FilterQuery, Model, ProjectionType } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(RefreshTokenEntity.name)
    private refreshTokenModel: Model<RefreshTokenEntity>,
  ) {}

  async register(dto: CreateUserDto) {
    return await this.userService.createOne(dto);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findOne({
      email: dto.email,
    });
    const errorMessage = 'Invalid credentials, try again';

    if (!user) {
      throw new BadRequestException(errorMessage);
    }

    const correctPassword = await bcrypt.compare(dto.password, user.password);

    if (!correctPassword) {
      throw new BadRequestException(errorMessage);
    }

    const userAccessPayload: UserAccessPayload = {
      sub: user._id as string,
      email: user.email,
      userName: user.userName,
      joinedAt: user.joinedAt,
    };
    const accessToken = this.generateAccessToken(userAccessPayload);
    const refreshToken = this.generateRefreshToken(userAccessPayload);
    const createdRefreshToken = await this.refreshTokenModel.create({
      token: refreshToken,
      userId: user._id,
    });
    await createdRefreshToken.save();
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(dto: RefreshAccessTokenDto) {
    const refreshToken = await this.findRefreshToken({
      token: dto.token,
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid or Expired token');
    }

    const user = await this.userService.findOne({ _id: refreshToken.userId });
    const accessToken = this.generateAccessToken({
      sub: user._id as string,
      email: user.email,
      userName: user.userName,
      joinedAt: user.joinedAt,
    });
    return { accessToken };
  }

  async logout(dto: LogoutDto) {
    const refreshToken = await this.findRefreshToken({
      token: dto.token,
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid or Expired token');
    }

    await refreshToken.deleteOne();
    return { message: 'Loggin out...' };
  }

  private generateAccessToken(payload: UserAccessPayload): string {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: '12h',
    });
    return accessToken;
  }

  private generateRefreshToken(payload: UserAccessPayload): string {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });
    return refreshToken;
  }

  private async findRefreshToken(
    filter: FilterQuery<RefreshTokenEntity>,
    projection?: ProjectionType<RefreshTokenEntity>,
  ) {
    const refreshToken = await this.refreshTokenModel.findOne(
      filter,
      projection,
    );
    return refreshToken;
  }
}
