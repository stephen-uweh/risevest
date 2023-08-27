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
import { FileUploadService } from '../helpers/file-upload.service';
import { TranscodeFile } from '../helpers/transcode';
import { UserService } from '../user/user.service';
import { GetSingleFileDto, UploadFileDto } from '../dto/file.dto';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { CreateFolderDto, GetSingleFolderDto } from '../dto/folder.dto';


config();

describe('UserController', () => {
    let folderController: FolderController;
    let folderService: FolderService

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
            controllers: [FolderController],
            providers: [FolderService, JwtService, AuthService, 
                LocalStrategy, JwtStrategy, AdminJwtStrategy, 
                AdminLocalStrategy, FileUploadService, TranscodeFile, UserService],
        }).compile();
    
        folderController = app.get<FolderController>(FolderController);
        folderService = app.get<FolderService>(FolderService);

        jest.setTimeout(60000);

    });


    it('should be defined', () => {
        expect(folderController).toBeDefined();
    });


    describe("Create a folder", () => {
        it("should return a created folder", async () => {
            let folderDto = new CreateFolderDto
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(folderService, 'createFolder').mockImplementation(async () => result)
            expect(await folderService.createFolder(folderDto, folderDto.userId)).toBe(result)
        }) 
    });

    describe("Get All User Folders", () => {
        it("should return all user folders", async () => {
            let userDto = new GetSingleUserDto;
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(folderService, 'getUserFolders').mockImplementation(async () => result)
            expect(await folderService.getUserFolders(userDto.userId)).toBe(result)
          }) 
    });

    describe("Get A Single File", () => {
        it("should return a single file", async () => {
            let folderDto = new GetSingleFolderDto;
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(folderService, 'getSingleFolder').mockImplementation(async () => result)
            expect(await folderService.getSingleFolder(folderDto.folderId)).toBe(result)
          }) 
    });

    
})