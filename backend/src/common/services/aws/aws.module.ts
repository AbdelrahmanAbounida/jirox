import { Module } from '@nestjs/common';
import { AwsSesService } from './services/aws.ses.service';
import { AwsS3Service } from './services/aws.s3.service';

@Module({
  controllers: [],
  providers: [AwsSesService, AwsS3Service],
  exports: [AwsSesService, AwsS3Service],
})
export class AwsModule {}
