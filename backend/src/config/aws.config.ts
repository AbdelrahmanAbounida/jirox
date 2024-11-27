import { registerAs } from '@nestjs/config';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { validateConfig } from 'src/common/utils/validate-config';

interface AWSConfigProps {
  access_key: string;
  secret_access_key: string;

  // s3
  s3_region: string;
  s3_bucket_name: string;

  // SES
  // ses_from_mail: string;
  // ses_host: string; // in caseof node mailer
  // ses_port: number; // in caseof node mailer
  // ses_region: string;
}

class AWSConfigValidator {
  @IsString()
  @IsOptional()
  S3_REGION: string;

  @IsString()
  @IsOptional()
  S3_BUCKET_NAME: string;

  @IsString()
  @IsOptional()
  AWS_ACCESS_KEY: string;

  @IsString()
  @IsOptional()
  AWS_SECRET_ACCESS_KEY: string;

  // @IsString()
  // SES_REGION: string;
  // @IsString()
  // SES_FROM_MAIL: string;
  // @IsString()
  // SES_HOST: string;
  // @IsNumber()
  // @Min(0)
  // @Max(65535)
  // SES_PORT: number;
}

export default registerAs<AWSConfigProps>('aws', () => {
  const config = {
    // Main
    access_key: process.env.AWS_ACCESS_KEY,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,

    // S3
    s3_region: process.env.S3_REGION,
    s3_bucket_name: process.env.S3_BUCKET_NAME,

    // SES
    // ses_from_mail: process.env.SES_FROM_MAIL,
    // ses_host: process.env.SES_HOST,
    // ses_port: parseInt(process.env.SES_PORT, 25),
    // ses_region: process.env.SES_REGION,
  };

  validateConfig(config, AWSConfigValidator);

  return config;
});
