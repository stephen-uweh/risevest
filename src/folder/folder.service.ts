import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorResponse } from "src/core/errors";
import { SuccessResponse } from "src/core/success";
import { FileEntity } from "src/entities/file.entity";
import { FolderEntity } from "src/entities/folder.entity";
import { UserEntity } from "src/entities/user.entity";
import { validateCreateFolder } from "src/validation/folder.validation";
import { Repository } from "typeorm";

@Injectable()
export class FolderService {
    constructor(
        @InjectRepository(FolderEntity) private readonly folderRepository: Repository<FolderEntity>,
        @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ){}

    async getUserFolders(userId:string){
        let folders = await this.folderRepository.findBy({userId:userId});
        return SuccessResponse(200, "User folders fetched successfully", folders, null)
    }

    async getSingleFolder(folderId:string){
        let folder = await this.folderRepository.findOne({where: {id:folderId}, relations: ['files', 'user']})
        if(folder){
            return SuccessResponse(200, "Folder fetched succwssfully", folder, null)
        }
        return ErrorResponse(404, "Folder not found", null, null)
    }

    async createFolder(data:any, userId:string){
        const { error } = validateCreateFolder(data);
        if (error) {
            return ErrorResponse(403, error.details[0].message, null, null);
        }
        let folderExists = await this.folderRepository.findOneBy({name: data.name, userId:userId});

        if(folderExists){
            return ErrorResponse(403, "Folder with the name already exists", null, null);
        }
        try{
            let newFolder = await this.folderRepository.save({
                name: data.name,
                userId: userId
            });
            return SuccessResponse(201, "Folder created successfully", newFolder, null);
        } catch(error){
            console.log(error)
            return ErrorResponse(500, "Error creating folder. Please try again", null, null)
        }
    }
}