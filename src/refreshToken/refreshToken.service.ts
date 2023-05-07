import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { RefreshToken, RefreshTokenDocument } from './refreshToken.model';

type InsertType = {
    token: string,
    expiresAt: Date,
    user: MongooseSchema.Types.ObjectId
}

@Injectable({})
export class RefreshTokenService {
    constructor(@InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>) {}

    async insertRefreshToken(refreshTokenProp: InsertType) {
        const refreshToken = new this.refreshTokenModel(refreshTokenProp);

         const result = await refreshToken.save();

         return result.id;
    }
}