import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorResponse } from "../core/errors";
import { SuccessResponse } from "../core/success";
import { FileEntity } from "../entities/file.entity";
import { FolderEntity } from "../entities/folder.entity";
import { UserEntity } from "../entities/user.entity";
import { FileUploadService } from "../helpers/file-upload.service";
import { TranscodeFile } from "../helpers/transcode";
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

    async uploadFile(file:any, data:any, userId:any){
        try{
            let fileId = uniqid();
            // let fileUrl = await this.fileUploadService.uploadSingleItem(file);
            let mimetype = file.mimetype
            let split = mimetype.split('/')
            let extension = split[split.length-1]
            let fileKey =   `${fileId}.${extension}`

            let url = await this.fileUploadService.uploadToAWS(file.buffer, fileKey)

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
                userId: userId,
                fileType: data.fileType,
                folderId: data.folderId ? data.folderId : null
            });
            if(data.fileType != "image"){   
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