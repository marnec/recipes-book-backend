import { User } from 'src/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';

export class UserRepository extends Repository<User> {
    

  async validateUserPassword(authCredentialDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialDto;

    const user = await this.getUserAndRoles({ username }, true);

    if (user && (await user.validatePassword(password))) {
      delete user.password;
      delete user.salt;
      return user;
    }
    return null;
  }

  async getUserAndRoles(where: FindOptionsWhere<User>, selectPsw = false): Promise<User> {
    return this.findOne({
      where,
      relations: { roles: true, language: true },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        enabled: selectPsw,
        password: selectPsw,
        salt: true
      }
    });
  }
}
