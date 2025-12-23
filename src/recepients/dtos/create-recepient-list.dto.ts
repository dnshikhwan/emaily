import { IsString } from 'class-validator';

export class createRecepientsListDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
