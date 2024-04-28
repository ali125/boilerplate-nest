import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { Public } from '@/decorators/public.decorator';
import { SignUpDTO } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDTO,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = request.cookies;

    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto,
      request.ip || '',
      request['user-agent'] || '',
      cookies,
      response,
    );

    response.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(
    @Body() signUpDto: SignUpDTO,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signUp(
      signUpDto,
      request.ip || '',
      request['user-agent'] || '',
    );

    response.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = request.cookies;
    await this.authService.signOut(cookies.jwt, response);
  }

  @Public()
  @Post('refreshAccessToken')
  async refreshAccessToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = request.cookies;

    const { accessToken, refreshToken } =
      await this.authService.refreshAccessToken(
        request.ip || '',
        request['user-agent'] || '',
        cookies.jwt,
      );

    response.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Get('profile')
  async getProfile(@Req() request: Request) {
    return await this.authService.getProfile(request.userId);
  }
}
