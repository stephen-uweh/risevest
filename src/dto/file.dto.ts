import { IsObject, IsString } from "class-validator";

export class UploadFileDto {
    @IsObject()
    file: object

    @IsString()
    fileType: string;

    @IsString()
    folderId?:string;
}


export class GetSingleFileDto {
    @IsString()
    fileId:string
}

export class GetUserFilesDto {
    @IsString()
    userId:string;
}