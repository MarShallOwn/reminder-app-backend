import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDTO, SignupDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import jsonResponse from 'src/utils/jsonResponse';
import { catchError } from 'src/utils/catchError';
import { generateAccessToken, generateRefreshToken } from 'src/utils/auth';

@Injectable({})
export class AuthService {
  //constructor(private prisma: PrismaService) {}
  constructor(private userService: UserService) {}

  async signin(dto: SigninDTO) {
    try {
      const user = await this.userService.findUserByEmail({ email: dto.email });
      if (!user || !(await bcrypt.compare(dto.password, user.password)))
        return jsonResponse(400, 'Incorrect Email or Password!', {
          error: 'Incorrect Email or Password!',
        });

      const accessToken = generateAccessToken(
        user._id,
        user.firstname,
        user.lastname,
      );
      const refreshToken = generateRefreshToken(
        user.id,
        user.firstname,
        user.lastname,
      );

      const expiresAtDate = new Date();
      expiresAtDate.setTime(expiresAtDate.getTime() + 24 * 60 * 60 * 1000); // 6 minutes expiary date === 0.1 || 1.2 minutes === 0.02
      const refreshTokenDB = {
        token: refreshToken,
        expiresAt: expiresAtDate,
        user,
      };

      // add the refresh token to the database
      await RefreshTokenModel.create(refreshTokenDB);

      // return statu 200 with access token and refresh token
      return jsonResponse(200, "User Logged In Successfully!", {data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        country: user.country,
        city: user.city,
        role: user.role,
        isVerified: user.isVerified,
        tokens: {
          accessToken,
          refreshToken,
        },
      } });
    } catch (err) {
      return catchError(err);
    }

    return { msg: 'Testing Signin' };
  }

  async getAccessToken(dto: any) {
    // get refresh token from body
    const refreshToken = req.body.hasOwnProperty('refreshToken')
      ? req.body.refreshToken
      : null;

    // if refresh token is null then return status 401
    if (refreshToken === null)
      return res
        .status(401)
        .json({ err: 'No refresh token provided!', data: null });

    // if refresh token exists then fetch it from DB
    const refreshTokenObj = await RefreshTokenModel.findOne({
      token: refreshToken,
    });

    // if refresh token wasn't found then return status of 401
    if (refreshTokenObj === null)
      return res.status(401).json({ err: 'unauthorized', data: null });

    // check if the expiary date of the refresh token ended or not
    // if expiary date ended then delete the refresh token and return status 403

    // TODO : we shouldn't delete the refresh token we should put it in the blacklist refresh token table
    const currentDate = new Date();
    const expiresAtDate = new Date(refreshTokenObj.expiresAt);
    if (expiresAtDate <= currentDate) {
      //await refreshTokenObj.deleteOne();
      return res
        .status(403)
        .json({ err: 'access is forbidden, login Again', data: null });
    }

    // check if refreshToken is valid if not return status 403
    // if it is valid then generate access token and return status 200 with the generated access token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ err: 'Something Wrong Happened', data: null });

      const accessToken = generateAccessToken(
        user.id,
        user.firstname,
        user.lastname,
      );
      return res.status(200).json({
        err: null,
        msg: 'Access Token Generated Successfully!',
        data: {
          accessToken,
        },
      });
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
