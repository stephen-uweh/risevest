import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SuccessResponse } from "src/core/success";
import { FileEntity } from "src/entities/file.entity";
import { UserEntity } from "src/entities/user.entity";
import { FileUploadService } from "src/helpers/file-upload.service";
import { Repository } from "typeorm";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
        private fileUploadService: FileUploadService
    ){}

    async uploadFile(data:any, user:any){
        let fileUrl = await this.fileUploadService.uploadSingleItem(data);

        let newFile = await this.fileRepository.save({
            fileUrl: fileUrl,
            fileSize: data.size,
            userId: user.id,
            folderName: data.folderName ? data.folderName : null
        })
        return SuccessResponse(201, "File uploaded successfully", newFile, null)
    }

    async getAllUserFiles(userId: string){
        let allFiles = await this.fileRepository.findBy({userId:userId});
        return SuccessResponse(300, "User files fetched successfully", allFiles, null);
    }

    async getSingleFile(fileId:string){
        let singleFile = await this.fileRepository.findOne({where: {id:fileId}, relations: ['user']});
        return SuccessResponse(300, "User file fetched successfully", singleFile, null);
    }
}