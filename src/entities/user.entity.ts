import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    password: string

    @Column({type: "enum", enum: UserRoleEnum, default: UserRoleEnum.USER})
    userRole: UserRoleEnum
}