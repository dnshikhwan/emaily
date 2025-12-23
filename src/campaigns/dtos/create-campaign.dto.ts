import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  subject: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  recepient_list_id: string[];

  @IsString()
  body: string;
}
