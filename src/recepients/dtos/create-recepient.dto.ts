import { IsString, IsUUID } from 'class-validator';

export class CreateRecepientDto {
  @IsUUID()
  list_id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;
}
