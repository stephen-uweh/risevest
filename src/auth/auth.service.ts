import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorResponse } from 'src/core/errors';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/core/success';
import { JwtService } from '@nestjs/jwt';
import { UserEntity, UserRoleEnum } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';





@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email:email });
    if (!user) ErrorResponse(404, 'No account exists for this user', null, null);
    const passwordValid = await this.userService.comparePassword(email, password)
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  
  async validateAdmin(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) ErrorResponse(404, 'No account exists for this user', null, null)
    if(user.userRole !== UserRoleEnum.ADMIN){
      // throw new UnauthorizedException(
       return ErrorResponse(401, 'User not authorized to view this page', null, null)
      // )
    }
    const passwordValid = await this.userService.comparePassword(email, password)
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  // async addAdmin(data:any){
  //   const { error } = validateCreateAdmin(data);
  //   if (error) {
  //     return ErrorResponse(403, error.details[0].message, null, null);
  //   }

  //   data['userRole'] = UserRoleEnum.ADMIN

  //   try{
  //     let newAdmin = this.userRepository.create(data)

  //     let createdAdmin = await this.userRepository.save(newAdmin)

  //     return SuccessResponse(
  //       201,
  //       "Admin addedd successfully",
  //       createdAdmin,
  //       null
  //     )
  //   } catch(error){
  //     return ErrorResponse(500, "Error creating admin", error.message, null)
  //   }
  // }
}
