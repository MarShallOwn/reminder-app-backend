import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDTO, SignupDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import jsonResponse from 'src/utils/jsonResponse';
import { catchError } from 'src/utils/catchError';

@Injectable({})
export class AuthService {
  //constructor(private prisma: PrismaService) {}
  constructor(private userService: UserService) {}

  signin(dto: SigninDTO) {
    return { msg: 'Testing Signin' };
  }

  async signup(dto: SignupDTO) {
    // generate hash password
    try {
      const hash = await bcrypt.hash(dto.password, 10);

      const userId = await this.userService.insertUser({
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        password: hash,
      });

      return jsonResponse(201, 'User Added Successfully', { data: { userId } });
    } catch (err) {
      return catchError(err);
    }
  }
}
