import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AdminJwtStrategy } from './adminjwt.strategy';
import { AdminLocalStrategy } from './admin.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { jwtConstants } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { entities } from '../entities';
import { CreateUserDto } from '../dto/user.dto';


describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        PassportModule, 
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60000000000000000s' },
        }), 
        UserModule
      ],
      controllers: [AuthController],
      providers: [UserService, JwtService, AuthService, 
        LocalStrategy, JwtStrategy, AdminJwtStrategy, 
        AdminLocalStrategy],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("Create an admin", () => {
    it("should return a created admin", async () => {
        let userDto = new CreateUserDto
        const result = {responseCode: 200, status:true, message: '', data: {}, meta: {}}
        jest.spyOn(authService, 'addAdmin').mockImplementation(async () => result)
        expect(await authService.addAdmin(userDto)).toBe(result)
    }) 
  });

});
