import { Injectable } from "@nestjs/common";


@Injectable({})
export class AuthService {
    signin() {
        return {msg: "Testing Signin"}
    }

    signup() {
        return {msg: "Testing Signup"}
    }
}