import {
  Body,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { EntityManager, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SigninDto } from 'src/dto/signin.dto';
import 'dotenv/config';
import { SignupDto } from 'src/dto/signup.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private dbManager: EntityManager;

  constructor(
    private readonly datasource: DataSource,
    private jwtService: JwtService,
  ) {
    this.dbManager = datasource.manager;
  }

  async register(@Body() signup: SignupDto): Promise<User> {
    const { password, ...userData } = signup;

    const existingUser = await this.dbManager.findOne(User, {
      where: {
        email: signup.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('Email already exist!!');
    }
    const passwordhash = await bcrypt.hash(password, 10);
    const user = await this.dbManager.create(User, {
      ...userData,
      password: passwordhash,
    });
    return this.dbManager.save(user);
  }

  async login(
    @Body() signin: SigninDto,
  ): Promise<{ accessToken: string; name: string }> {
    const { email, password } = signin;

    const user = await this.dbManager.findOne(User, {
      where: { email },
    });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (user && isValidPassword) {
      const payload: JwtPayload = { userId: user.id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken, name: user.userName };
    } else {
      throw new UnauthorizedException('Please check your login credentials.');
    }
  }
}

// private generateToken(user: User): string {
//   const payload = { id: user.id, email: user.email };
//   const secretKey = process.env.JWT_SECRET;
//   const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
//   return token;
// }

//   const isValidPassword = await bcrypt.compare(password, user.password);
//   if (!isValidPassword) {
//     throw new Error('Invalid password');
//   }

//   const accessToken = this.generateToken(user);
//   return { accessToken };
// }

// if (!user) {
//   throw new Error('User not found, register as new User!!!');
