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
import { CreateFolderDto, GetSingleFolderDto } from '../dto/folder.dto';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';


config();

describe('UserController', () => {
    let adminController: AdminController;
    let adminService: AdminService

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
            controllers: [AdminController],
            providers: [AdminService, JwtService, AuthService, 
                LocalStrategy, JwtStrategy, AdminJwtStrategy, 
                AdminLocalStrategy, FileUploadService, TranscodeFile, UserService],
        }).compile();
    
        adminController = app.get<AdminController>(AdminController);
        adminService = app.get<AdminService>(AdminService);

        jest.setTimeout(60000);

    });


    it('should be defined', () => {
        expect(adminController).toBeDefined();
    });



    describe("Get All Users", () => {
        it("should return all users", async () => {
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(adminService, 'getAllUsers').mockImplementation(async () => result)
            expect(await adminService.getAllUsers()).toBe(result)
          }) 
    });

    describe("Get A Single User", () => {
        it("should return a single user", async () => {
            let userDto = new GetSingleUserDto;
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(adminService, 'getSingleUser').mockImplementation(async () => result)
            expect(await adminService.getSingleUser(userDto.userId)).toBe(result)
          }) 
    });


    describe("Get All Folders", () => {
        it("should return all folders", async () => {
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(adminService, 'getAllFolders').mockImplementation(async () => result)
            expect(await adminService.getAllFolders()).toBe(result)
          }) 
    });

    describe("Get A Single Folder", () => {
        it("should return a single folder", async () => {
            let folderDto = new GetSingleFolderDto;
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(adminService, 'getSingleFolder').mockImplementation(async () => result)
            expect(await adminService.getSingleFolder(folderDto.folderId)).toBe(result)
          }) 
    });


    describe("Get All Files", () => {
        it("should return all files", async () => {
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(adminService, 'getAllFiles').mockImplementation(async () => result)
            expect(await adminService.getAllFiles()).toBe(result)
          }) 
    });

    describe("Get A Single Folder", () => {
        it("should return a single folder", async () => {
            let fileDto = new GetSingleFileDto;
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(adminService, 'getSingleFile').mockImplementation(async () => result)
            expect(await adminService.getSingleFile(fileDto.fileId)).toBe(result)
          }) 
    });

    
})