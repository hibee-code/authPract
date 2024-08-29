import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import 'dotenv/config';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable() // Make sure to use the Injectable decorator
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly datasource: DataSource) {
    super({
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId } = payload;

    // Use datasource.manager directly here
    const user: User = await this.datasource.manager.findOne(User, {
      select: ['id', 'email', 'password'],
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('An Unauthorized User!!!');
    }

    return user;
  }
}
