import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { config } from 'dotenv';
import { UserService } from "./user.service";
import { FileEntity } from "../entities/file.entity";
import { FolderEntity } from "../entities/folder.entity";
import { UserController } from "./user.controller";


config();

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity, FileEntity, FolderEntity]),
        JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '600000000000000000s' },
        }),
        PassportModule,
    ],
    controllers: [UserController],
    providers: [UserService]
})

export class UserModule {}