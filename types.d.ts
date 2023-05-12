import { Schema as MongooseSchema } from "mongoose"

export type RefreshTokenType = {
    token: string,
    expiresAt: Date,
    user: MongooseSchema.Types.ObjectId
}

export type JWTPayload = {
    _id: string,
    firstname: string,
    lastname: string,
    iat: number,
    exp: number
  }