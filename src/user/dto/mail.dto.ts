import { IsEmail } from 'class-validator';

export class MailDto {
  @IsEmail()
  email: string;
}
