import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
