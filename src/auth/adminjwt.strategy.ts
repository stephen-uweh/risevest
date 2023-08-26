import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserEntity, UserRoleEnum } from 'src/entities/user.entity';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    if(payload.userType == UserRoleEnum.ADMIN){
      return {user: payload}
    }
    return null
  }
}