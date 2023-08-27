import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { FolderService } from "./folder.service";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('folder')
export class FolderController {
    constructor(
        private folderService: FolderService
    ){}

    @Post('create')
    async createFolder(@Res() res, @Req() req, @Body() body){
        let response = await this.folderService.createFolder(body, req.user.user.id);
        return res.status(response.responseCode).send(response);
    }

    @Get('user-folders')
    async getUserFolders(@Res() res, @Req() req){
        let response = await this.folderService.getUserFolders(req.user.user.id);
        return res.status(response.responseCode).send(response);
    }

    @Get('single/:folderId')
    async getSingleFolder(@Res() res, @Param('folderId') param){
        let response = await this.folderService.getSingleFolder(param.folderId);
        return res.status(response.responseCode).send(response);
    }
}