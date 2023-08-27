import { IsString } from "class-validator";

export class CreateFolderDto {
    @IsString()
    name:string;

    @IsString()
    userId:string;
}

export class GetSingleFolderDto {
    @IsString()
    folderId:string;
}

export class GetUserFolders {
    @IsString()
    userId:string;
}