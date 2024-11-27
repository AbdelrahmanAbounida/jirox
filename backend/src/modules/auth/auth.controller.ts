import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDTO, SignupAuthDTO } from './dto/create-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from './decorator/current-user.decorator';

// @Public()

// TODO:: No need for this as authentication will be done through nextauth in frontend

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(
    // @Body() signupAuthDTO: SignupAuthDTO,
    @CurrentUser() user: any,
  ) {
    // return this.authService.signup(signupAuthDTO);
    return { user };
  }

  @Post('signin')
  signIn(@Body() signinAuthDTO: SigninAuthDTO) {
    return this.authService.signIn(signinAuthDTO);
  }
}
