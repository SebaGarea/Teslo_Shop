import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsStrongPassword()
  password!: string;

  @IsString()
  @MinLength(1)
  fullName!: string;

  //   @IsString()
  //   isActive: boolean;

  //   @IsString({ each: true })
  //   @IsArray()
  //   roles: string[];
}
