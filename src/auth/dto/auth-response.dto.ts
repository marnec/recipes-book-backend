import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ required: false })
  user?: UserDto;
}
