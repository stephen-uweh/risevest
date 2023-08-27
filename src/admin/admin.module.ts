import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "dotenv";
import { FileEntity } from "../entities/file.entity";
import { FolderEntity } from "../entities/folder.entity";
import { UserEntity } from "../entities/user.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { LocalStrategy } from "../auth/local.strategy";
import { JwtStrategy } from "../auth/jwt.strategy";
import { AuthService } from "../auth/auth.service";
import { AdminJwtStrategy } from "../auth/adminjwt.strategy";
import { AdminLocalStrategy } from "../auth/admin.strategy";
import { UserService } from "../user/user.service";
import { jwtConstants } from "../auth/constants";

config(); 

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity, FileEntity, FolderEntity]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60000000000000000s' },
        }), 
        PassportModule,
    ],
    controllers: [AdminController],
    providers: [AdminService,LocalStrategy, JwtStrategy, 
        AuthService, AdminJwtStrategy, 
        AdminLocalStrategy, UserService, JwtService]
})
export class AdminModule {}