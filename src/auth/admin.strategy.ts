import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ErrorResponse } from 'src/core/errors';
// import {ErrorResponse} from 'src/core/response/errors';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy, 'adminlogin') {
  constructor(private authService: AuthService) {
    super({
        usernameField: 'email',
        passwordField: 'password',
      });
  }

  async validate(username: string, password: string): Promise<any> {
    const admin = await this.authService.validateAdmin(username, password);
    if (!admin) {
      // throw new UnauthorizedException(
      //   ErrorResponse(401, 'Incorrect admin credentials', null, null)
      // );
      return ErrorResponse(401, 'Unauthorized', null, null)

    }
    return admin;
  }
}