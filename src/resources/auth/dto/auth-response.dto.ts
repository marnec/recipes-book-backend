import { UserDto } from 'src/resources/user/dto/user.dto';

export class AuthResponseDto {
  accessToken: string;

  refreshToken: string;

  user?: UserDto;
}
