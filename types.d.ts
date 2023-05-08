import { Schema as MongooseSchema } from "mongoose"

export type RefreshTokenType = {
    token: string,
    expiresAt: Date,
    user: MongooseSchema.Types.ObjectId
}