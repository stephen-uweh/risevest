import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { FolderEntity } from "./folder.entity";

@Entity({name: 'files', orderBy: {created_at: "DESC"}})
export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId:string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;

    @Column({nullable: false})
    fileUrl: string;

    @Column({nullable: true})
    fileSize: string;

    @Column({nullable:true})
    fileType: string;

    @Column({nullable: true})
    fileId: string;

    @Column({nullable:true})
    hls: string;

    @Column({nullable: true})
    folderId: string;

    @ManyToOne(() => FolderEntity, (folder) => folder.id, {nullable: true})
    folder: FolderEntity;

    @Column({default: true})
    safe: boolean

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;

}