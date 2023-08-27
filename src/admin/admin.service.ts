import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorResponse } from "../core/errors";
import { SuccessResponse } from "../core/success";
import { FileEntity } from "../entities/file.entity";
import { FolderEntity } from "../entities/folder.entity";
import { UserEntity, UserRoleEnum } from "../entities/user.entity";
import { validateCreateUser } from "../validation/user.validation";
import { IsNull, Repository } from "typeorm";
import * as bcryptjs from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FolderEntity) private readonly folderRepository: Repository<FolderEntity>,
        @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
        private jwtService: JwtService
    ){}

    async addAdmin(data:any){
        const { error } = validateCreateUser(data);
        if (error) {
          return ErrorResponse(403, error.details[0].message, null, null);
        }
    
        data['userRole'] = UserRoleEnum.ADMIN
    
        const salt = await bcryptjs.genSalt(10);
    
        const hash = await bcryptjs.hashSync(data.password, salt);
        data.password = hash;
    
        try{
    
          let createdAdmin = await this.userRepository.save(data)
    
          const token = this.jwtService.sign(
            JSON.parse(JSON.stringify(createdAdmin)),
          );
    
          return SuccessResponse(
            201,
            "Admin addedd successfully",
            { token },
            null
          )
        } catch(error){
          return ErrorResponse(500, "Error creating admin", error.message, null)
        }
    }

    async getAllUsers(){
        let users = await this.userRepository.findBy({userRole: UserRoleEnum.USER});
        return SuccessResponse(200, "All users fetched successfully", users, null)
    }

    async getSingleUser(userId:string){
        console.log(userId)
        let user = await this.userRepository.findOne({where: {id:userId}, relations:['files', 'folders']});
        if(user){
            return SuccessResponse(200, "User fetched successfully", user, null)
        }
        return ErrorResponse(404, "User not found", null, null)
    }

    async getAllFolders(){
        let folders = await this.folderRepository.find();
        return SuccessResponse(200, "All folders fetched successfully", folders, null)
    }

    async getSingleFolder(folderId){
        let singleFolder = await this.folderRepository.findOne({where:{id:folderId}, relations: ['files', 'user']});
        if(singleFolder){
            return SuccessResponse(200, "Folder fetched succwssfully", singleFolder, null)
        }
        return ErrorResponse(404, "Folder not found", null, null)
    }

    async getAllFiles(){
        let files = await this.fileRepository.find();
        return SuccessResponse(200, "All files fetched successfully", files, null)
    }

    async getSingleFile(fileId:string){
        let singleFile = await this.fileRepository.findOne({where: {id:fileId}, relations: ['user', 'folder']})
        if(singleFile){
        return SuccessResponse(200, "Single file fetched successfully", singleFile, null)

        }
    }

    async markAsUnsafe(fileId:string){
        let file = await this.fileRepository.findOneBy({id:fileId});
        if(file){
            await this.fileRepository.delete({id:fileId});
            return SuccessResponse(200, "File marked as unsafe and deleted", null, null)
        }
        return ErrorResponse(404, "File not found. May have been deleted", null, null)
    }

}