import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { config } from 'dotenv';
import { UserService } from "./user.service";


config();

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '600000000000000000s' },
        }),
        PassportModule,
    ],
    controllers: [],
    providers: [UserService]
})

export class UserModule {}