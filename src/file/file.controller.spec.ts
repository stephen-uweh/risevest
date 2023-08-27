import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { FileEntity } from '../entities/file.entity';
import { FolderEntity } from '../entities/folder.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'dotenv';
import { CreateUserDto, GetSingleUserDto } from '../dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { LocalStrategy } from '../auth/local.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AdminJwtStrategy } from '../auth/adminjwt.strategy';
import { AdminLocalStrategy } from '../auth/admin.strategy';
import { entities } from '../entities';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileUploadService } from '../helpers/file-upload.service';
import { TranscodeFile } from '../helpers/transcode';
import { UserService } from '../user/user.service';
import { UploadFileDto } from '../dto/file.dto';


config();

describe('UserController', () => {
    let fileController: FileController;
    let fileService: FileService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => ({
                      type: 'postgres',
                      host: configService.get('DATABASE_HOST'),
                      port: configService.get('DATABASE_PORT'),
                      username: configService.get('DATABASE_USER'),
                      password: configService.get('DATABASE_PASSWORD'),
                      database: configService.get('DATABASE_NAME'),
                      entities: entities,
                      synchronize: true,
                      logging: configService.get('NODE_ENV') === 'dev' ? true : false,
                      logger: 'advanced-console',
                      ssl: null,
                    }),
                  }),
                TypeOrmModule.forFeature([UserEntity, FileEntity, FolderEntity]),
                JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '600000000000000000s' },
                }),
                PassportModule,
            ],
            controllers: [FileController],
            providers: [FileService, JwtService, AuthService, 
                LocalStrategy, JwtStrategy, AdminJwtStrategy, 
                AdminLocalStrategy, FileUploadService, TranscodeFile, UserService],
        }).compile();
    
        fileController = app.get<FileController>(FileController);
        fileService = app.get<FileService>(FileService);

        jest.setTimeout(60000);

    });


    it('should be defined', () => {
        expect(fileController).toBeDefined();
    });


    describe("Upload a file", () => {
        it("should return an uploaded file", async () => {
            let fileDto = new UploadFileDto, userDto = new GetSingleUserDto
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(fileService, 'uploadFile').mockImplementation(async () => result)
            expect(await fileService.uploadFile(fileDto.file, fileDto, userDto.userId)).toBe(result)
        }) 
    });

    
})