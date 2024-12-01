import { IsNumber, IsString } from 'class-validator';

export class createColumnDto {
  @IsString()
  name: string;

  @IsNumber()
  positoin: number;
}

export class updateColumnDto extends createColumnDto {
  @IsString()
  columnId: string;
}
