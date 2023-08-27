import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { FileEntity } from "./file.entity";

@Entity({name: 'folder', orderBy: {created_at: "DESC"}})

export class FolderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    userId:string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;

    @OneToMany(() => FileEntity, (file) => file.folder, {cascade: true})
    files: FileEntity[]

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;
}