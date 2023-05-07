import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { User } from "src/user/user.model";

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
    @Prop({ required: true })
    token: string;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: "User" })
    user: User;

    @Prop({ required: true, default: Date.now })
    createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)