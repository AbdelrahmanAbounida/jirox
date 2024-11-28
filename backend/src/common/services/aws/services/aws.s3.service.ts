import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'; // Use S3Client instead of S3
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('aws.access_key'),
        secretAccessKey: this.configService.get('aws.secret_access_key'),
      },
      region: this.configService.get('aws.s3_region'),
    });
  }

  async uploadFile({
    file,
    userId,
  }: {
    file: Express.Multer.File;
    userId: string;
  }): Promise<string> {
    const params = {
      Bucket: this.configService.get('aws.s3_bucket_name'),
      Key: `logos/${userId}/${file.originalname}`,
      Body: file.buffer,
    };
    try {
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      return `https://${this.configService.get('aws.s3_bucket_name')}.s3.${this.configService.get('aws.s3_region')}.amazonaws.com/logos/${userId}/${file.originalname}`;
    } catch (error) {
      console.log({ S3Error: error });
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  async replaceFile({
    newFile,
    oldFileName,
    userId,
  }: {
    newFile: Express.Multer.File;
    oldFileName: string;
    userId: string;
  }): Promise<string> {
    const params = {
      Bucket: this.configService.get('aws.s3_bucket_name'),
      Key: `logos/${userId}/${newFile.originalname}`,
      Body: newFile.buffer,
    };

    try {
      // 1- delete old file
      if (oldFileName) {
        console.log({ oldFileName });
        await this.deleteFile({ userId, fileName: oldFileName });
      }
      // 2- upload new one
      const command = new PutObjectCommand(params); // Create command for replacement
      await this.s3Client.send(command);

      return `https://${this.configService.get('aws.s3_bucket_name')}.s3.${this.configService.get('aws.s3_region')}.amazonaws.com/logos/${userId}/${newFile.originalname}`;
    } catch (error) {
      throw new Error(`Error replacing file: ${error.message}`);
    }
  }

  async deleteFile({
    userId,
    fileName,
  }: {
    userId: string;
    fileName: string; // Specify the file name to delete
  }): Promise<void> {
    const params = {
      Bucket: this.configService.get('aws.s3_bucket_name'),
      Key: `logos/${userId}/${fileName}`, // Use userId and file name for deletion
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
}
