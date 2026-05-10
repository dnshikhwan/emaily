import { BadRequestException, Injectable, Res } from '@nestjs/common';
import argon2 from 'argon2';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { type Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    // destructure dto
    const { email, password, first_name, last_name } = createUserDto;

    // check for duplicate email
    const existing = await this.usersService.findByEmail(email);
    if (existing)
      throw new BadRequestException('User with this email already exists');

    // get hashed password
    const hashedPassword = await this.hashPassword(password);

    // create user object
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    return {
      message: 'User successfully signed up',
      user,
    };
  }

  async login(
    loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = loginUserDto;

    // find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Invalid email or password');

    // compare password
    const passwordMatches = await this.comparePassword(user.password, password);
    if (!passwordMatches)
      throw new BadRequestException('Invalid email or password');

    // create jwt token
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
    };
    const token = this.jwtService.sign(payload);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // return
    return {
      message: 'User successfully logged in',
      token,
    };
  }

  // hash password
  hashPassword(password: string) {
    return argon2.hash(password);
  }

  // compare password and hash
  comparePassword(hash: string, password: string) {
    return argon2.verify(hash, password);
  }
}
