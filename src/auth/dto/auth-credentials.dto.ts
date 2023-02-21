import { IsString } from 'class-validator';

// credentials dto to login
export class AuthCredentialsDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
