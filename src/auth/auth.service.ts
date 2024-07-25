import { Body, ConflictException, Injectable } from '@nestjs/common';
import { SingnupDto } from 'src/dto/signup.dto';
import { User } from 'src/entities/user.entity';
import { EntityManager, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private dbManager: EntityManager;

  constructor(private readonly datasource: DataSource) {
    this.dbManager = datasource.manager;
  }

  async register(@Body() signup: SingnupDto): Promise<User> {
    const { password, ...userData } = signup;

    const existingUser = await this.dbManager.findOne(User, {
      where: {
        email: signup.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('Email already exist!!');
    }
    const paswordhash = await bcrypt.hash(password, 10);
    const user = await this.dbManager.create(User, {
      ...userData,
      pasword: paswordhash,
    });
    const saveUser = await this.dbManager.save(user);
    return saveUser;
  }
}
