import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from './auth.controller';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { config } from 'dotenv';
import { UserModule } from "src/user/user.module";
import { UserEntity } from "src/entities/user.entity";
import { UserService } from "src/user/user.service";
import { AdminJwtStrategy } from "./adminjwt.strategy";
import { AdminLocalStrategy } from "./admin.strategy";

config();

@Module({
  imports: [
    PassportModule, 
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60000000000000000s' },
    }), 
    ConfigModule.forRoot(),
    UserModule
  ],
  providers: [UserService, AuthService, 
    LocalStrategy, JwtStrategy, 
    AuthService, AdminJwtStrategy, 
    AdminLocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}