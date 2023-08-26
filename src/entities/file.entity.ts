import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: 'files'})
export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId:string;

    @ManyToOne(() => UserEntity, (user) => user.id, {cascade: true})
    user: UserEntity

    @Column({nullable: false})
    fileUrl: string;

    @Column({nullable: true})
    fileSize: string;

    @Column({nullable: true})
    folderName: string;

}