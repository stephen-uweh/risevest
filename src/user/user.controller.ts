import { Body, Controller, Post, Res } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Post('register')
    async registerUser(@Res() res, @Body() body){
        let response = await this.userService.createUser(body);
        return res.status(response.responseCode).send(response);
    }
}