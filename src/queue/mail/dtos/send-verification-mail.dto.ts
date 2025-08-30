import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendVerificationMailDto {
  @IsEmail()
  to: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
