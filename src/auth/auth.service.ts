import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}

    signin() {
        console.log("Hit the backend")
        return {msg: "Testing Signin"}
    }

    signup() {
        return {msg: "Testing Signup"}
    }
}