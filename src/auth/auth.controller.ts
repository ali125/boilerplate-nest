import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { Public } from '@/decorators/public.decorator';
import { SignUpDTO } from './dto/sign-up.dto';
import { RoleId, UserId } from '@/decorators/userId.decorator';
import { ProfileDTO } from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePassowrdDTO } from './dto/changePassword.dto';
import { ForgotDTO } from './dto/forgot.dto';
import { ResetPassowrdDTO } from './dto/resetPassword.dto';

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
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signUp(
      signUpDto,
      ip,
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

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot')
  async forgot(@Body() forgotDto: ForgotDTO) {
    return this.authService.forgot(forgotDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPassowrdDTO) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('profile')
  async getProfile(@UserId() userId: string) {
    return await this.authService.getProfile(userId);
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Post('profile')
  async updateProfile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3 * 1024 * 1024,
            message: 'expected size is less than 3 Mb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
        exceptionFactory(err) {
          return new BadRequestException({
            property: 'avatar',
            message: [err],
          });
        },
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: string,
    @Body() profileDto: ProfileDTO,
  ) {
    return await this.authService.updateProfile(userId, {
      ...profileDto,
      avatar: file?.path,
    });
  }

  @Post('changePassword')
  async updatePassword(
    @UserId() userId: string,
    @Body() changePasswordDto: ChangePassowrdDTO,
  ) {
    return await this.authService.updatePasssword(userId, changePasswordDto);
  }

  @Get('role')
  async getPermissions(@RoleId() roleId: string | null) {
    return await this.authService.getPermissions(roleId);
  }
}
