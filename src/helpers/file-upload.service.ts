import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import toStream = require('buffer-to-stream');
import { cloudinaryConfig } from '../config/cloudinary.config';

@Injectable()
export class FileUploadService {
  private cloudinaryUploadService: typeof cloudinary.uploader;

  constructor() {
    cloudinary.config(cloudinaryConfig);
    this.cloudinaryUploadService = cloudinary.uploader;
  }
  
  uploadSingleItem(doc: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryUploadService.upload_stream(
        (error: Error, result: UploadApiResponse) => {
          if (result) {
            // console.log(result.secure_url);
            resolve(result.secure_url);
          } else reject(error);
        }
      );

      toStream(doc.buffer).pipe(uploadStream);
    });
  }
  public getResourceType(files: Express.Multer.File): any {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = files.originalname.split('.').pop().toLowerCase();

    if (imageExtensions.includes(fileExtension)) {
      return 'image';
    } else {
      return 'raw';
    }
  }
}
