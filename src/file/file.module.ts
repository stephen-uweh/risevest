import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "src/entities/file.entity";
import { UserEntity } from "src/entities/user.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity, FileEntity]),
        JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '600000000000000000s' },
        }),
        PassportModule,
    ],
    controllers: [],
    providers: []
})

export class FileModule {}