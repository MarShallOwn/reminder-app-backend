import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDTO, SignupDTO, TokenDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import jsonResponse from 'src/utils/jsonResponse';
import { catchError } from 'src/utils/catchError';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';
import { JWTPayload, RefreshTokenType } from 'types';
import { Schema } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private jwtService: JwtService,
  ) {}

  /**
   *
   * @param {String} firstname
   * @param {String} lastname
   * @description generate access token that stores user data and returns it
   * @returns {String} Access token
   */
  private async generateAccessToken(
    _id: Schema.Types.ObjectId,
    firstname: string,
    lastname: string,
  ) {
    return await this.jwtService.signAsync(
      { _id, firstname, lastname },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    );
  } // normally it should be 15 mins === 900s

  /**
   *
   * @param {String} firstname
   * @param {String} lastname
   * @description generate refresh token that stores user data and returns it
   * @returns {String} Refresh token
   */
  private async generateRefreshToken(
    _id: Schema.Types.ObjectId,
    firstname: string,
    lastname: string,
  ) {
    return await this.jwtService.signAsync(
      { _id, firstname, lastname },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '43200s',
      },
    );
  }

  async signin(dto: SigninDTO) {
    try {
      const user = await this.userService.findUserByEmail({ email: dto.email });
      if (!user || !(await bcrypt.compare(dto.password, user.password)))
        return jsonResponse(400, 'Incorrect Email or Password!', {
          error: 'Incorrect Email or Password!',
        });

      const userId = user._id as unknown as Schema.Types.ObjectId;

      const accessToken = await this.generateAccessToken(
        userId,
        user.firstname,
        user.lastname,
      );
      const refreshToken = await this.generateRefreshToken(
        userId,
        user.firstname,
        user.lastname,
      );

      const expiresAtDate: Date = new Date();
      expiresAtDate.setTime(expiresAtDate.getTime() + 0.05 * 60 * 60 * 1000); // 6 minutes expiary date === 0.1 || 1.2 minutes === 0.02
      const refreshTokenDB: RefreshTokenType = {
        token: refreshToken,
        expiresAt: expiresAtDate,
        user: userId,
      }; //24 * 60 * 60 * 1000

      // add the refresh token to the database
      await this.refreshTokenService.insertRefreshToken(refreshTokenDB);

      // return status 200 with access token and refresh token
      return jsonResponse(200, 'User Logged In Successfully!', {
        data: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          tokens: {
            accessToken,
            refreshToken,
            accessTokenExpiry: (
              this.jwtService.decode(accessToken) as JWTPayload
            ).exp,
          },
        },
      });
    } catch (err) {
      return catchError(err);
    }
  }

  async getAccessToken(dto: TokenDTO) {
    // get refresh token from body
    const refreshToken: string | null = dto.token || null;

    // if refresh token is null then return status 401
    if (refreshToken === null)
      return jsonResponse(401, 'No refresh token provided!', {
        error: 'No refresh token provided!',
        data: null,
      });

    // if refresh token exists then fetch it from DB
    const refreshTokenObj = await this.refreshTokenService.findRefreshToken(
      refreshToken,
    );

    // if refresh token wasn't found then return status of 401
    if (refreshTokenObj === null)
      return jsonResponse(401, 'unauthorized', {
        error: 'unauthorized',
        data: null,
      });

    // check if the expiary date of the refresh token ended or not
    // if expiary date ended then delete the refresh token and return status 403

    // TODO : we shouldn't delete the refresh token we should put it in the blacklist refresh token table
    const currentDate = new Date();
    const expiresAtDate = new Date(refreshTokenObj.expiresAt);
    if (expiresAtDate <= currentDate) {
      //await refreshTokenObj.deleteOne();
      return jsonResponse(403, 'access is forbidden, login Again', {
        error: 'access is forbidden, login Again',
        data: null,
      });
    }

    try {
      // check if refreshToken is valid if not return status 403
      // if it is valid then generate access token and return status 200 with the generated access token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      const user = payload;

      const accessToken = await this.generateAccessToken(
        user._id,
        user.firstname,
        user.lastname,
      );

      return jsonResponse(200, 'Access Token Generated Successfully!', {
        data: {
          accessToken,
          accessTokenExpiry: (this.jwtService.decode(accessToken) as JWTPayload).exp,
        },
      });
    } catch {
      throw new UnauthorizedException();
    }
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

  async profile() {
    return jsonResponse(200, 'Profile being accessed', { data: null });
  }
}
