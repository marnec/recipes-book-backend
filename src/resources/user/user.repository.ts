import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';

export class UserRepository extends Repository<User> {
  async getUserAndRoles(where: FindOptionsWhere<User>, selectPsw = false): Promise<User> {
    return this.findOne({
      where,
      relations: { language: true },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        enabled: selectPsw,
      }
    });
  }
}
