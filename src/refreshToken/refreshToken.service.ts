import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Schema } from "mongoose";
import { RefreshToken, RefreshTokenDocument } from './refreshToken.model';
import { RefreshTokenType } from "types";


@Injectable({})
export class RefreshTokenService {
    constructor(@InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>) {}

    async insertRefreshToken(refreshTokenProp: RefreshTokenType) {
        const refreshToken = new this.refreshTokenModel(refreshTokenProp);

         const result = await refreshToken.save();

         return result.id;
    }

    async findRefreshToken(token: string) {
        return await this.refreshTokenModel.findOne({token: token});
    }
}