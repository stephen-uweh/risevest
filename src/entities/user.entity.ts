import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { FileEntity } from "./file.entity";
import { FolderEntity } from "./folder.entity";

export enum UserRoleEnum {
    USER = "user",
    ADMIN = "admin"
}

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    firstName: string;

    @Column({nullable: false})
    lastName: string;

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({type: "enum", enum: UserRoleEnum, default: UserRoleEnum.USER})
    userRole: UserRoleEnum;

    @OneToMany(() => FileEntity, (file) => file.user, {cascade: true})
    files: FileEntity[]

    @OneToMany(() => FolderEntity, (folder) => folder.user, {cascade: true})
    folders: FolderEntity[]

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;
}