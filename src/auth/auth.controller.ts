import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorCode, ErrorMessage } from 'src/exception/application-exceptions.enum';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

/* eslint-disable class-methods-use-this */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthResponseDto> {
    return await this.authService.login(authCredentialsDto);
  } // login

  @Post('/refresh')
  async refresh(@Body('refreshToken') refreshToken: string): Promise<AuthResponseDto> {
    return await this.authService.refresh(refreshToken);
  } // refresh

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    await this.authService.hanldeResetPasswordRequest(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException(
        ErrorMessage.passwordsDoNotMatch,
        ErrorCode.passwordsDoNotMatch
      );
    }

    await this.authService.resetPassword(resetPasswordDto);
  }
} // AuthController
