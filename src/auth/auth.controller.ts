import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Body() dto: SigninDTO) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  signup(@Body() dto: SignupDTO) {
    return this.authService.signup(dto);
  }
}

// we don't use
// signup(@Req() req: Request, @Res() res: Response)
// because what if we want to switch express with another framework like fast defy or any other
// so using decorators is better so instead of the one on top we use like that
// signup(@Body dto: any)
// using the body decorator allows us to reuse the code for any other framework that we will integrate with
// a dto is a Data Transfer Object that is the shape of the Object that we are expecting to use
// with the data that we are waiting for
