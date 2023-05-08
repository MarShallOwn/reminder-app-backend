import { Injectable } from '@nestjs/common';
import { SigninDTO, SignupDTO, TokenDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import jsonResponse from 'src/utils/jsonResponse';
import { catchError } from 'src/utils/catchError';
import { generateAccessToken, generateRefreshToken } from 'src/utils/auth';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';
import { RefreshTokenType } from 'types';
import { Schema } from 'mongoose';
import { JwtService } from '@nestjs/jwt';


@Injectable({})
export class AuthService {
  //constructor(private prisma: PrismaService) {}
  constructor(private userService: UserService, private refreshTokenService: RefreshTokenService, private jwtService: JwtService) {}

  async signin(dto: SigninDTO) {
    try {
      const user = await this.userService.findUserByEmail({ email: dto.email });
      if (!user || !(await bcrypt.compare(dto.password, user.password)))
        return jsonResponse(400, 'Incorrect Email or Password!', {
          error: 'Incorrect Email or Password!',
        });

      const userId = (user._id as unknown) as Schema.Types.ObjectId

      const accessToken = generateAccessToken(
        userId,
        user.firstname,
        user.lastname,
      );
      const refreshToken = generateRefreshToken(
        userId,
        user.firstname,
        user.lastname,
      );

      const expiresAtDate: Date = new Date();
      expiresAtDate.setTime(expiresAtDate.getTime() + 24 * 60 * 60 * 1000); // 6 minutes expiary date === 0.1 || 1.2 minutes === 0.02
      const refreshTokenDB : RefreshTokenType = {
        token: refreshToken,
        expiresAt: expiresAtDate,
        user: userId,
      };

      // add the refresh token to the database
      await this.refreshTokenService.insertRefreshToken(refreshTokenDB);

      // return statu 200 with access token and refresh token
      return jsonResponse(200, "User Logged In Successfully!", {data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        tokens: {
          accessToken,
          refreshToken,
        },
      } });
    } catch (err) {
      console.log(err)
      return catchError(err);
    }
  }

  async getAccessToken(dto: TokenDTO) {
    // get refresh token from body
    const refreshToken: string | null = dto.token || null;

    // if refresh token is null then return status 401
    if (refreshToken === null)
    return jsonResponse(401, "No refresh token provided!", {error: 'No refresh token provided!', data: null });

    // if refresh token exists then fetch it from DB
    const refreshTokenObj = await this.refreshTokenService.findRefreshToken(refreshToken);
    

    // if refresh token wasn't found then return status of 401
    if (refreshTokenObj === null)
    return jsonResponse(401, "unauthorized", {error: 'unauthorized', data: null });

    // check if the expiary date of the refresh token ended or not
    // if expiary date ended then delete the refresh token and return status 403

    // TODO : we shouldn't delete the refresh token we should put it in the blacklist refresh token table
    const currentDate = new Date();
    const expiresAtDate = new Date(refreshTokenObj.expiresAt);
    if (expiresAtDate <= currentDate) {
      //await refreshTokenObj.deleteOne();
      return jsonResponse(403, 'access is forbidden, login Again', {error: 'access is forbidden, login Again', data: null });
    }

    // check if refreshToken is valid if not return status 403
    // if it is valid then generate access token and return status 200 with the generated access token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
      return jsonResponse(403, 'Something Wrong Happened', {error: 'Something Wrong Happened', data: null });

      const accessToken = generateAccessToken(
        user._id,
        user.firstname,
        user.lastname,
      );
      return jsonResponse(200, "Access Token Generated Successfully!", {error: 'Something Wrong Happened', data: {accessToken} });
    });
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
