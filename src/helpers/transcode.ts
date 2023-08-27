const Path = require('path');
const ffmpeg = require('fluent-ffmpeg');
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { FileUploadService } from './file-upload.service';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { Repository } from 'typeorm';
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
import { S3 } from 'aws-sdk';
import { createReadStream } from 'fs';


export class TranscodeFile {
    constructor(
        @Inject(FileUploadService) private fileUploadService: FileUploadService,
        @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>
    ){}
    async transcode(payload: any) {
        try {
          const generateRandomId = uuidv4().slice(0, 10);
          ffmpeg.setFfmpegPath(ffmpegInstaller.path);
          fs.mkdirSync(`output/${payload.fileId}`);
          const path = payload.fileUrl;
    
          ffmpeg(path, { timeout: 432000 })
            .addOptions([
              '-profile:v baseline',
              '-level 3.0',
              '-vf scale=-2:1080',
              '-start_number 0',
              '-hls_time 4',
              '-hls_list_size 0',
              '-f hls',
            ])
            .output(`output/${payload.fileId}/output.m3u8`)
            .on('end', async () => {
              console.log('Transcoding started');

              let filePath = `output/${payload.fileId}/output.m3u8`

              let transcodeUpload = await this.uploadTranscodedFile(payload.fileId, filePath);
              if(transcodeUpload){
                let file = await this.fileRepository.findOneBy({fileId:payload.fileId});
                if(file){
                    file.hls = transcodeUpload;
                    await this.fileRepository.save(file);
                }
              }
              return 200;
            })
            .run();
        } catch (error) {
          console.log(error);
          return 500;
        }
    }

    async probe(path: string) {
        return await new Promise((resolve) => {
          ffmpeg.ffprobe(path, function (err: any, data: any) {
            const metaData = data?.streams;
            if (metaData) {
              const streams = metaData[0];
              const duration = streams?.duration;
              resolve(duration);
            }
          });
        });
    }
    
    async deleteFiles(dir: string) {
    fs.rm(dir, { recursive: true }, function (err) {
        if (err) {
        return console.log(err);
        }
        console.log("File deleted")
    });
    }

    async uploadTranscodedFile(fileId, filePath){
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        });
        let response = await s3
          .upload({
            Key: `${fileId}/output.m3u8`,
            Bucket: process.env.AWS_BUCKET,
            Body: createReadStream(filePath),
        }).promise();
        return response.Location
    }
}