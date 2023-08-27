import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorResponse } from "src/core/errors";
import { SuccessResponse } from "src/core/success";
import { FileEntity } from "src/entities/file.entity";
import { FolderEntity } from "src/entities/folder.entity";
import { UserEntity } from "src/entities/user.entity";
import { FileUploadService } from "src/helpers/file-upload.service";
import { TranscodeFile } from "src/helpers/transcode";
import { Repository } from "typeorm";
import uniqid from 'uniqid';


@Injectable()
export class FileService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
        @InjectRepository(FolderEntity) private readonly folderRepository: Repository<FolderEntity>,
        private fileUploadService: FileUploadService,
        private transcodeFile: TranscodeFile
    ){}

    async uploadFile(file:any, data:any, user:any){
        try{
            let fileId = uniqid();
            // let fileUrl = await this.fileUploadService.uploadSingleItem(file);

            let url = await this.fileUploadService.uploadToAWS(file.buffer, fileId)

            if(data.folderId){
                let folder = await this.folderRepository.findOneBy({id:data.folderId});
                if(!folder){
                    return ErrorResponse(404, "Invalid folder ID", null, null);
                }
            }

            let newFile = await this.fileRepository.save({
                fileUrl: url,
                fileSize: file.size,
                fileId: fileId,
                userId: user.id,
                fileType: data.fileType,
                folderId: data.folderId ? data.folderId : null
            });
            if(data.fileType != "image"){   
                console.log("Transcode started")
                await this.transcodeFile.transcode({fileUrl: url, fileId:fileId})
            }
            return SuccessResponse(201, "File uploaded successfully", newFile, null);
        } catch(error){
            console.log(error);
            return ErrorResponse(500, "Error uploading file. Please try again", null, null)
        }
    }

    async getAllUserFiles(userId: string){
        let allFiles = await this.fileRepository.findBy({userId:userId});
        return SuccessResponse(300, "User files fetched successfully", allFiles, null);
    }

    async getSingleFile(fileId:string){
        let singleFile = await this.fileRepository.findOne({where: {id:fileId}, relations: ['user', 'folder']});
        return SuccessResponse(300, "User file fetched successfully", singleFile, null);
    }
}