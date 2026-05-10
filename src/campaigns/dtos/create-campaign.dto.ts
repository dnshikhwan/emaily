import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { CampaignPriority } from '../types/campaign-priority.enum';

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

  @IsOptional()
  @IsEnum(CampaignPriority)
  priority?: CampaignPriority;
}
