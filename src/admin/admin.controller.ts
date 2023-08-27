import { Body, Controller, Get, Param, Patch, Post, Res, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard, JwtAuthGuard } from "../guard/jwt-auth.guard";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController {
    constructor(
        private adminServie: AdminService
    ){}

    // @Post('create')
    // async createAdmin(@Res() res, @Body() body){
    //     let response = await this.adminServie.addAdmin(body);
    //     return res.status(response.responseCode).send(response);
    // }

    @UseGuards(AdminJwtAuthGuard)
    @Get('users')
    async getAllUsers(@Res() res){
        let response = await this.adminServie.getAllUsers();
        return res.status(response.responseCode).send(response);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('users/:userId')
    async getSingleUser(@Res() res, @Param('userId') param){
        let response = await this.adminServie.getSingleUser(param);
        return res.status(response.responseCode).send(response);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('folders')
    async getAllFolders(@Res() res){
        let response = await this.adminServie.getAllFolders();
        return res.status(response.responseCode).send(response);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('folders/:folderId')
    async getSingleFolder(@Res() res, @Param('folderId') param){
        let response = await this.adminServie.getSingleFolder(param.folderId);
        return res.status(response.responseCode).send(response);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('files')
    async getAllFiles(@Res() res){
        let response = await this.adminServie.getAllFiles();
        return res.status(response.responseCode).send(response);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('files/:fileId')
    async getSingleFile(@Res() res, @Param('fileId') param){
        let response = await this.adminServie.getSingleFile(param.fileId);
        return res.status(response.responseCode).send(response);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('files/:fileId/unsafe')
    async markFileAsUnsafe(@Res() res, @Param('fileId') param){
        let response = await this.adminServie.markAsUnsafe(param.fileId);
        return res.status(response.responseCode).send(response);
    }
}