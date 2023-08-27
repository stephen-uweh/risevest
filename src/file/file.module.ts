import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "src/entities/file.entity";
import { FolderEntity } from "src/entities/folder.entity";
import { UserEntity } from "src/entities/user.entity";
import { FileUploadService } from "src/helpers/file-upload.service";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { TranscodeFile } from "src/helpers/transcode";

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