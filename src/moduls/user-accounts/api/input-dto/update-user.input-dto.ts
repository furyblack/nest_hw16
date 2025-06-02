import { IsEmail } from 'class-validator';
import { UpdateUserDto } from '../../dto/create-user.dto';

export class UpdateUserInputDto implements UpdateUserDto {
  @IsEmail()
  email: string;
}
