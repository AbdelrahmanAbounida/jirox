import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class LogoValidationPipe implements PipeTransform {
  private readonly MAX_SIZE = 10 * 1024 * 1024; // Maximum size in bytes (10MB)

  transform(value: any, metadata: ArgumentMetadata) {
    if (value && value.size) {
      const file = value as Express.Multer.File;

      // Check the file size
      if (file.size > this.MAX_SIZE) {
        throw new BadRequestException(
          `File size exceeds the maximum limit of ${this.MAX_SIZE / (1024 * 1024)} MB`,
        );
      }
    }
    return value;
  }
}
