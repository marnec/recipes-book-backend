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
import { EmailNotificationDto } from 'src/notifier-client/dto/email.dto';
import { EmailNotification } from 'src/notifier-client/email.notification';
import { DataSource, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetRequest } from './password-reset-request.entity';
import bcrypt = require('bcryptjs');
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/entities/user.entity';

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
    private emailNotificationService: EmailNotification,
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

  private async getValidRequest(
    requests: PasswordResetRequest[],
    user: User
  ): Promise<PasswordResetRequest> {
    const currentDate = await this.getCurrentDateTime();

    const request = requests.find((requestF) => !this.isExpired(requestF, currentDate));

    try {
      if (request === undefined || request === null) {
        const rq = new PasswordResetRequest();
        rq.user = user;
        rq.token = uuidv4();
        this.logger.debug(`Password reset ${user.email}: new request created`);
        return await this.passwordResetRepository.save(rq);
      }
      this.logger.debug(`Password reset ${user.email}: pending request found`);
      return request;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private createResetPasswordLink(passwordResetRequest: PasswordResetRequest): string {
    const path: string = process.env.PASSWORD_RESET_PATH;

    if (path === null || path === undefined) {
      this.logger.error('PASSWORD_RESET_PATH invalid');
      throw new InternalServerErrorException();
    }

    return `${path}${passwordResetRequest.token}`;
  }

  async hanldeResetPasswordRequest(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.enabled) {
      throw new ApplicationException(ErrorMessage.userNotFound, ErrorCode.userNotFound);
    }

    const pendingRequest = await this.passwordResetRepository.find({
      where: { user: { id: user.id }, fulfilled: false }
    });
    const request: PasswordResetRequest = await this.getValidRequest(pendingRequest, user);

    const link = this.createResetPasswordLink(request);
    this.logger.debug(`Password reset: link created ${link}`);
    const emailData: EmailNotificationDto = new EmailNotificationDto();
    emailData.to = [email];
    emailData.from = process.env.NOTIFICATION_FROM_ADDRESS;
    emailData.subject = '------';
    emailData.body = `-------- ${link}`;
    emailData.fake = process.env.NOTIFIER_FAKE_EMAIL === 'true';

    await this.emailNotificationService.send(emailData);

    return true;
  }

  async sendPassword(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.enabled) {
      this.logger.debug(`New password to ${email}, user not found`);
      return false;
    }

    this.logger.debug(`Password changed`);
    const emailData: EmailNotificationDto = new EmailNotificationDto();
    emailData.to = [email];
    emailData.from = process.env.NOTIFICATION_FROM_ADDRESS;
    emailData.subject = '------';
    emailData.body = `-------- your new password is ${password}`;
    emailData.fake = process.env.NOTIFIER_FAKE_EMAIL === 'true';

    await this.emailNotificationService.send(emailData);

    return true;
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
