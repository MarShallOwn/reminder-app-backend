import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEqualTo } from 'src/decorator';

export class SigninDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignupDTO {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @IsEqualTo('password')
  confirmPassword: string;
}
