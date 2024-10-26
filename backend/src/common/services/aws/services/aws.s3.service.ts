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
    workspaceId,
  }: {
    file: Express.Multer.File;
    workspaceId: string;
  }): Promise<string> {
    const params = {
      Bucket: this.configService.get('aws.s3_bucket_name'),
      Key: `logos/${workspaceId}/${file.originalname}`, // Include original file name
      Body: file.buffer,
    };

    try {
      const command = new PutObjectCommand(params); // Create command for the upload
      await this.s3Client.send(command); // Send the command to S3

      return `https://${this.configService.get('aws.s3_bucket_name')}.s3.${this.configService.get('aws.s3_region')}.amazonaws.com/logos/${workspaceId}/${file.originalname}`;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  async replaceFile({
    newFile,
    workspaceId,
  }: {
    newFile: Express.Multer.File;
    workspaceId: string;
  }): Promise<string> {
    const params = {
      Bucket: this.configService.get('aws.s3_bucket_name'),
      Key: `logos/${workspaceId}/${newFile.originalname}`, // Ensure the same key for replacement
      Body: newFile.buffer,
    };

    try {
      const command = new PutObjectCommand(params); // Create command for replacement
      await this.s3Client.send(command);

      return `https://${this.configService.get('aws.s3_bucket_name')}.s3.${this.configService.get('aws.s3_region')}.amazonaws.com/logos/${workspaceId}/${newFile.originalname}`;
    } catch (error) {
      throw new Error(`Error replacing file: ${error.message}`);
    }
  }

  async deleteFile({
    workspaceId,
    fileName,
  }: {
    workspaceId: string;
    fileName: string; // Specify the file name to delete
  }): Promise<void> {
    const params = {
      Bucket: this.configService.get('aws.s3_bucket_name'),
      Key: `logos/${workspaceId}/${fileName}`, // Use workspaceId and file name for deletion
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
}
