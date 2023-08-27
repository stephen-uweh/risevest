import {
  Body,
  Controller,
  Req,
  Res,
  Post,
  UseGuards,
  Logger,
  Get,
} from '@nestjs/common';
import { AdminAuthGuard, LocalAuthGuard } from '../guard/local-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SuccessResponse } from '../core/success';
import { ErrorResponse } from '../core/errors';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';



@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private authService: AuthService
  ) {}


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Body() body) {
    return SuccessResponse(
      200,
      'User logged in successfully',
      { token: this.jwtService.sign(JSON.parse(JSON.stringify(req.user)))},
      null,
    );
  }


  @UseGuards(AdminAuthGuard)
  @Post('admin/login')
  async adminLogin(@Req() req: any, @Body() body) {
    return SuccessResponse( 200, 'Admin logged in successfully', { token: this.jwtService.sign(JSON.parse(JSON.stringify(req.user))) }, null);
  }


  @Post('add/admin')
  async addAdmin(@Res() res, @Body() body){
    let response = await this.authService.addAdmin(body)
    return res.status(response.responseCode).send(response)
  }
}
