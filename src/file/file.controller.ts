import { Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FileController {
    constructor(
        private fileService: FileService
    ){}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res, @Req() req, @Body() body){
        let response = await this.fileService.uploadFile(file, body, req.user.user);
        return res.status(response.responseCode).send(response);
    }

    @Get('user-files')
    async getUserFiles(@Res() res, @Req() req){
        let response = await this.fileService.getAllUserFiles(req.user.user.id);
        return res.status(response.responseCode).send(response);
    }

    @Get('single/:fileId')
    async getSingleFile(@Res() res, @Param('fileId') param){
        let response = await this.fileService.getSingleFile(param.fileId);
        return res.status(response.responseCode).send(response);
    }
}