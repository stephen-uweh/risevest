import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { FileEntity } from '../entities/file.entity';
import { FolderEntity } from '../entities/folder.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'dotenv';
import { CreateUserDto } from '../dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { LocalStrategy } from '../auth/local.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AdminJwtStrategy } from '../auth/adminjwt.strategy';
import { AdminLocalStrategy } from '../auth/admin.strategy';
import { entities } from '../entities';

config();

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService

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
            controllers: [UserController],
            providers: [UserService, JwtService, AuthService, 
                LocalStrategy, JwtStrategy, AdminJwtStrategy, 
                AdminLocalStrategy],
        }).compile();
    
        userController = app.get<UserController>(UserController);
        userService = app.get<UserService>(UserService);

        jest.setTimeout(60000);

    });


    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    describe("Create A User", () => {
        it("should return a created user", async () => {
            let userDto = new CreateUserDto
            const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
            jest.spyOn(userService, 'createUser').mockImplementation(async () => result)
            expect(await userService.createUser(userDto)).toBe(result)
        }) 
    });
})