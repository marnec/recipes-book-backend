import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogModule } from 'src/log/log.module';
import { NotifierClientModule } from 'src/notifier-client/notifier-client.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PasswordResetRequest } from './password-reset-request.entity';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordResetRequest]),
    UserModule,
    LogModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRESIN
      }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NotifierClientModule.register({
      host: process.env.NOTIFIER_URL,
      port: parseInt(process.env.NOTIFIER_PORT, 10),
      app: process.env.NOTIFIER_APP,
      https: process.env.NOTIFIER_HTTPS === 'true',
      token: process.env.NOTIFIER_TOKEN,
      httpOptions: {
        maxRedirects: 3,
        timeout: 5000
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AuthService]
})
export class AuthModule {}
