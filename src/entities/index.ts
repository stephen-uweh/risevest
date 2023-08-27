import { FileEntity } from "./file.entity";
import { FolderEntity } from "./folder.entity";
import { UserEntity } from "./user.entity";


export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

/**
 * Entities
 *
 */
export const entities = [
  UserEntity,
  FileEntity,
  FolderEntity
];
