import {
  Injectable
} from '@nestjs/common';
import { ErrorCode, ErrorMessage } from 'src/exception/application-exceptions.enum';
import { ApplicationException } from 'src/exception/application.exception';
import { FAKE_PSW, FAKE_SALT } from 'src/shared/constant';
import { UpsertUserDto } from './dto/upsert-user.dto';
import { Language } from './entities/language.entity';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

  constructor(private userRepository: UserRepository) {}

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new ApplicationException(ErrorMessage.userNotFound, ErrorCode.userNotFound);
    }

    return user;
  }

  public async insertUser(insertUserDto: UpsertUserDto): Promise<User> {
    const user = new User();
    user.username = insertUserDto.username;
    user.email = insertUserDto.email;
    user.name = insertUserDto.name;
    user.surname = insertUserDto.surname;
    user.enabled = insertUserDto.enabled;
    user.language = { id: insertUserDto.languageId } as Language;

    const { id } = await this.userRepository.save(user);

    return this.userRepository.findOne({ where: { id } });
  } 
}
