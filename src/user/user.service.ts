import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorResponse } from "../core/errors";
import { UserEntity } from "../entities/user.entity";
import { validateCreateUser } from "../validation/user.validation";
import { Repository } from "typeorm";
import * as bcryptjs from 'bcryptjs';
import { SuccessResponse } from "../core/success";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService,

    ){}

    async createUser(data:any){
        const { error } = validateCreateUser(data);
        if (error) {
            return ErrorResponse(403, error.details[0].message, null, null);
        }

        let userExists = await this.userRepository.findOneBy({email: data['email']})
        if(userExists){
            return ErrorResponse(409, "User already registered with this email", null, null);
        }

        const salt = await bcryptjs.genSalt(10);

        const hash = await bcryptjs.hashSync(data.password, salt);
        data.password = hash;

        let newUser

        try{
            newUser = await this.userRepository.save(data);

            const token = this.jwtService.sign(
                JSON.parse(JSON.stringify(newUser)),
            );

            return SuccessResponse(201, "User created succesfully", {...newUser, token:token}, null);
        } catch(error){
            console.log(error)
            if(newUser && newUser.id){
                await this.userRepository.delete(newUser.id)
            }
            return ErrorResponse(500, "Error registering user. Please try again", null, null)
        }
    }

    async comparePassword(email:string, password:string) {
        let user = await this.userRepository.findOneBy({ email: email });
        if (!user) {
          return ErrorResponse(404, 'No user with this email exists', null, null);
        }
        return bcryptjs.compare(password, user.password).catch((e) => false);
    }
}