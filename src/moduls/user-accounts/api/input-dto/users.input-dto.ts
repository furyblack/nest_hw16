import { IsEmail, IsString, Length } from 'class-validator';

import {
  loginConstraints,
  passwordConstraints,
} from '../../domain/user.entity';
import { Trim } from '../../../../core/decarators/transform/trim';
import { IsStringWithTrim } from '../../../../core/decarators/validation/is-string-with-trim';

export class CreateUserInputDto {
  @IsStringWithTrim(loginConstraints.minLength, loginConstraints.maxLength)
  // @LoginIsExist()
  login: string;

  @IsString()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  @Trim()
  password: string;

  @IsString()
  @IsEmail()
  // @Matches(emailConstraints.match)
  @Trim()
  email: string;
}
