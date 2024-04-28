import { RefreshTokensService } from '@/refresh-tokens/refresh-tokens.service';
import { UsersService } from '@/users/users.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { TokensType } from './interface/token.interface';
import { SignUpDTO } from './dto/sign-up.dto';
import { SignInDTO } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private refreshTokenService: RefreshTokensService,
    private jwtService: JwtService,
  ) {}

  async createAuthTokens(email: string, userId: string): Promise<TokensType> {
    const accessToken = await this.jwtService.signAsync({
      userId,
      email,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        email,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '1d',
      },
    );

    return { accessToken, refreshToken };
  }

  async signIn(
    signInDto: SignInDTO,
    ip: string,
    userAgent: string,
    cookies: Record<string, any>,
    response: Response,
  ): Promise<TokensType> {
    const userAuth = await this.usersService.findOneAuth(signInDto.email);

    // evaluate password
    const match = await bcrypt.compare(signInDto.password, userAuth.password);
    if (!match) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.createAuthTokens(signInDto.email, userAuth.id);

    if (cookies?.jwt) {
      /**
       * Scenario added here
       * 1) User logs in but never uses RT and does not logout
       * 2) RT is stolen
       * 3) If 1 & 2, reuse detection is neede to clear all RTs when user logs in
       */
      const refreshToken = cookies.jwt;
      const foundToken = await this.refreshTokenService.findOne(refreshToken);

      // Detected refresh token reuse!
      if (!foundToken) {
        // clear out ALL previous refresh tokens
        response.clearCookie('jwt', {
          httpOnly: true,
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000,
        });
        await this.refreshTokenService.removeByUserId(userAuth.id);
      } else {
        await this.refreshTokenService.removeByToken(refreshToken);
      }
    }

    this.refreshTokenService.create({
      ip,
      userAgent,
      token: newRefreshToken,
      userId: userAuth.id,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async signUp(
    signUpDto: SignUpDTO,
    ip: string,
    userAgent: string,
  ): Promise<TokensType> {
    const user = await this.usersService.create(signUpDto);

    const { accessToken, refreshToken: newRefreshToken } =
      await this.createAuthTokens(signUpDto.email, user.id);

    this.refreshTokenService.create({
      ip,
      userAgent,
      token: newRefreshToken,
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async signOut(cookieJwtToken: string | undefined, response: Response) {
    // On client, also delete the accessToken
    if (!cookieJwtToken) return;

    const foundToken =
      await this.refreshTokenService.removeByToken(cookieJwtToken);

    if (!foundToken) {
      // "sameSite" => if the front-end is not in the same domain, this option should add as(sameSite: "none")
      // "httpOnly" => cookie is not available to javascript
      // scure: true => Don't use this while testing on "Thunder client"
      response.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });
      throw new ForbiddenException();
    }
    // Delete refreshToken in db
    const result = await this.refreshTokenService.removeByToken(cookieJwtToken);
    console.log(result);

    // secure: true => Don't use this while testing on "Thunder client"
    response.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  async refreshAccessToken(
    ip: string,
    userAgent: string,
    cookieJwtToken?: string,
  ) {
    if (!cookieJwtToken) {
      throw new UnauthorizedException();
    }
    const foundToken = await this.refreshTokenService.findOne(cookieJwtToken);

    if (!foundToken) {
      try {
        const payload = await this.jwtService.verifyAsync(cookieJwtToken, {
          secret: process.env.REFRESH_TOKEN_SECRET,
        });
        console.log('attempted refresh token reuse!');
        const hackedUser = await this.usersService.findOneAuth(payload.email);
        if (hackedUser) {
          const result = await this.refreshTokenService.removeByUserId(
            hackedUser.id,
          );
          console.log(result);
        }
      } catch {
        throw new UnauthorizedException();
      }
    }

    // evaluate jwt
    try {
      const payload = await this.jwtService.verifyAsync(cookieJwtToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      const user = await this.usersService.findOneAuth(payload.email);
      if (!user) {
        throw new UnauthorizedException();
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.createAuthTokens(user.email, user.id);

      this.refreshTokenService.create({
        ip,
        userAgent,
        token: newRefreshToken,
        userId: user.id,
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      console.log('expired refresh token');
      await this.refreshTokenService.removeByToken(cookieJwtToken);
      throw new UnauthorizedException();
    }
  }

  async getProfile(id: string) {
    return await this.usersService.findOne(id);
  }
}
