import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { ErrorCode, ErrorMessage } from 'src/exception/application-exceptions.enum';
import { ApplicationException } from 'src/exception/application.exception';
import { DataSource, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetRequest } from './password-reset-request.entity';
import bcrypt = require('bcryptjs');
import { UserRepository } from 'src/resources/user/user.repository';
import { User } from 'src/resources/user/entities/user.entity';

export interface refreshTokenPayload {
  userId: string;
  isRefreshToken: boolean;
}

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  passwordResetRepository: Repository<PasswordResetRequest>;

  constructor(
    private jwtService: JwtService,
    private dataSoruce: DataSource,
    private userRepository: UserRepository
  ) {
    this.passwordResetRepository = this.dataSoruce.getRepository(PasswordResetRequest);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<AuthResponseDto> {
    this.logger.log('logging in');
    const user: User = await this.userRepository.validateUserPassword(authCredentialsDto);
    if (!user) {
      throw new UnauthorizedException({
        message: ErrorMessage.invalidCredentials,
        code: ErrorCode.invalidCredentials
      });
    }
    if (!user.enabled) {
      throw new ApplicationException(ErrorMessage.userDisabled, ErrorCode.userDisabled);
    }

    const { accessToken, refreshToken }: AuthResponseDto = this.getTokensByUser(user);
    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    try {
      this.jwtService.verify(refreshToken);
      const refreshPayload = this.jwtService.decode(refreshToken) as refreshTokenPayload;

      if (refreshPayload.isRefreshToken) {
        const { accessToken, refreshToken }: AuthResponseDto = await this.getTokensByPayload(
          refreshPayload
        );
        return { accessToken, refreshToken };
      }
      throw Error;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(ErrorMessage.refreshFail, ErrorCode.refreshFail);
    }
  }

  private getTokensByUser(user: User): AuthResponseDto {
    return this.getTokens(user);
  }

  private async getTokensByPayload(payload: refreshTokenPayload): Promise<AuthResponseDto> {
    const user: User = await this.userRepository.getUserAndRoles({ id: payload?.userId }, false);
    return this.getTokensByUser(user);
  }

  private getTokens(user: User | number): AuthResponseDto {
    const payload = {
      userId: user instanceof User ? user.id : user,
      roles: user instanceof User ? user.roles : []
    };
    const accessToken = this.jwtService.sign(payload);

    const refPayload = { isRefreshToken: true, userId: payload.userId };
    const refreshToken = this.jwtService.sign(refPayload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRESIN
    });

    return { accessToken, refreshToken };
  }

  async getCurrentDateTime(): Promise<Date> {
    try {
      const results = (await this.dataSoruce
        .createQueryRunner()
        .manager.query(`SELECT CURRENT_TIMESTAMP AS now;`)) as [{ now: string }];

      if (results && results.length > 0 && results[0].now) {
        return new Date(results[0].now);
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private isExpired(passwordResetRequest: PasswordResetRequest, currentDate: Date): boolean {
    const timeout: number = +process.env.PASSWORD_RESET_TIMEOUT;

    if (timeout === null || timeout === undefined) {
      this.logger.error('PASSWORD_RESET_TIMEOUT invalid');
      throw new InternalServerErrorException();
    }

    const expirationMoment: moment.Moment = moment(passwordResetRequest.created).add(timeout, 'ms');

    return moment(currentDate).isAfter(expirationMoment);
  }

  @Transactional()
  public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const passwordResetRequest = await this.passwordResetRepository.findOneOrFail({
      where: { token: resetPasswordDto.token }
    });
    this.logger.debug(`Reset password: found request for ${passwordResetRequest.user.email}`);

    if (
      this.isExpired(passwordResetRequest, await this.getCurrentDateTime()) ||
      passwordResetRequest.fulfilled === true
    ) {
      this.logger.debug(`Invalid request. ${JSON.stringify(passwordResetRequest)}`);
      throw new BadRequestException(
        ErrorMessage.passwordResetTimeout,
        ErrorCode.passwordResetTimeout
      );
    }

    try {
      const user = passwordResetRequest.user;
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(resetPasswordDto.password, salt);
      user.password = hash;
      user.salt = salt;
      await this.userRepository.save(user);

      passwordResetRequest.fulfilled = true;
      await this.passwordResetRepository.save(passwordResetRequest);
      this.logger.debug(`Password update, request closed!`);

      return true;
    } catch (error) {
      return false;
    }
  }
}
