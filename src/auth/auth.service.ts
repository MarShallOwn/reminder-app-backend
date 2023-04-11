import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SigninDTO, SignupDTO } from "./dto";
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "src/schemas";
import { Model } from "mongoose";


@Injectable({})
export class AuthService {
    //constructor(private prisma: PrismaService) {}
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    signin(dto: SigninDTO) {
        return {msg: "Testing Signin"}
    }

    async signup(dto: SignupDTO) {
        // generate hash password
        try {
            const hash = await bcrypt.hash(dto.password, 10);

            /*
            const user = await this.prisma.user.create({
                data: {
                    firstname: dto.firstname,
                    lastname: dto.lastname,
                    email: dto.email,
                    password: hash
                }
            })
            */
           const user = new this.userModel({
            firstname: dto.firstname,
            lastname: dto.lastname,
            email: dto.email,
            password: hash
        });

           user.save();

            return {message: "User Added Successfully", user};
        } catch (err) {
            console.log(err)
            if(err instanceof Error) {
                return {message: [err.message], error: err}
            }
            else {
                return {message: ["Something Went Wrong"], error: err}
            }
        }

        // save the new user to the database

        // return the saved user
        return {msg: "Testing Signup"}
    }
}