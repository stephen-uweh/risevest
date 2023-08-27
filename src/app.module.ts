import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { FolderModule } from './folder/folder.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600000000000000000s' },
    }),
    PassportModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    FileModule,
    FolderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
