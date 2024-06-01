import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './user.model';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { UserAccessPayload } from './user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}

  async createOne(dto: CreateUserDto) {
    const user = await this.findOne({ email: dto.email });

    if (user) {
      throw new UnauthorizedException(
        'This Email is already linked with another account',
      );
    }

    const password = await bcrypt.hash(dto.password, 10);
    const createdUser = await this.userModel.create({
      email: dto.email,
      password,
      userName: dto.userName,
      joinedAt: Date.now(),
    });
    await createdUser.save();
    return {
      message: `Hi ${dto.userName} you will be re-directed to the login page`,
    };
  }

  async accessProfile(payload: UserAccessPayload) {
    const profile = await this.findOne(
      { _id: payload.sub },
      { password: false },
    );

    if (!profile) {
      throw new NotFoundException('No profile found with the given id');
    }

    return { profile };
  }

  async findAll(
    filter?: FilterQuery<UserEntity>,
    projection?: ProjectionType<UserEntity>,
  ) {
    const users = await this.userModel.find(filter, projection);
    return users;
  }

  async findOne(
    filter: FilterQuery<UserEntity>,
    projection?: ProjectionType<UserEntity>,
  ) {
    const user = await this.userModel.findOne(filter, projection);
    return user;
  }
}
