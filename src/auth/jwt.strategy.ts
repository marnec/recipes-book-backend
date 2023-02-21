import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { JwtPaylaod } from './dto/jwt-payload.dto';
dotenv.config({ path: './.env' });

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  userRepository: Repository<User>;
  constructor(private dataSource: DataSource) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    });
    this.userRepository = dataSource.getRepository(User);
  }

  // la validazione consiste nel guardare se il nome utente che é nel token
  // esiste nel database, non viene verificata ancha la password
  async validate(payload: JwtPaylaod): Promise<any> {
    const { userId, isRefreshToken } = payload;
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || isRefreshToken || !user.enabled) {
      throw new UnauthorizedException();
    }

    return { user };
  } // validate
} // JwtStrategy
