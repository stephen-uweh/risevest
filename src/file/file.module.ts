import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "../entities/file.entity";
import { FolderEntity } from "../entities/folder.entity";
import { UserEntity } from "../entities/user.entity";
import { FileUploadService } from "../helpers/file-upload.service";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { TranscodeFile } from "../helpers/transcode";

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
    controllers: [FileController],
    providers: [FileUploadService, FileService, TranscodeFile]
})

export class FileModule {}