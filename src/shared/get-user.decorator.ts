import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from '@nestjs/common';
import { camelizeKeys } from 'fast-case';
import { JWTUserData } from 'src/resources/user/dto/jwt-user-data.dto';
import { User } from 'src/resources/user/entities/user.entity';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): JWTUserData => {
  const request = ctx.switchToHttp().getRequest();

  const user = Buffer.from(
    (request.headers.authorization as string).split('.')[1],
    'base64url'
  ).toString();

  try {
    return camelizeKeys(JSON.parse(user)) as unknown as JWTUserData;
  } catch (error) {
    throw new InternalServerErrorException(
      'could not parse user',
      `user is not a JSON object: ${user}`
    );
  }
});
