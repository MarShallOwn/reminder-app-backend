import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/user.model";

type InsertType = {
    firstname: string,
    lastname: string,
    email: string,
    password: string
}


@Injectable({})
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async insertUser({firstname , lastname, email, password}: InsertType) {
        const user = new this.userModel({
            firstname,
            lastname,
            email,
            password
        });

         const result = await user.save();

         return result.id;
    }

    async findUserById({id}: {id: string}) {
        const user = await this.userModel.findById(id);

         return user;
    }

    async findUserByEmail({email}: {email: string}) {
        const user = await this.userModel.findOne({ email });

         return user;
    }
}