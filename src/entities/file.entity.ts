import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { FolderEntity } from "./folder.entity";

@Entity({name: 'files', orderBy: {created_at: "DESC"}})
export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId:string;

    @ManyToOne(() => UserEntity, (user) => user.id, {cascade: true})
    user: UserEntity;

    @Column({nullable: false})
    fileUrl: string;

    @Column({nullable: true})
    fileSize: string;

    @Column({nullable: true})
    folderId: string;

    @ManyToOne(() => FolderEntity, (folder) => folder.id, {cascade: true, nullable: true})
    folder: FolderEntity

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;

}