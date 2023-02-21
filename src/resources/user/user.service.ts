import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Language } from 'src/entities/language.entity';
import { Role } from 'src/entities/role.entity';
import { ErrorCode, ErrorMessage } from 'src/exception/application-exceptions.enum';
import { ApplicationException } from 'src/exception/application.exception';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import { FAKE_PSW, FAKE_SALT } from 'src/shared/constant';
import { PaginatedResult } from 'src/shared/paginated-result.dto';
import { UpsertUserDto } from './dto/upsert-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(
    private userRepository: UserRepository
  ) {}

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new ApplicationException(ErrorMessage.userNotFound, ErrorCode.userNotFound);
    }

    return user;
  }

  async getUserList(
    userFilterDto: UserFilterDto,
    pageable: Pageable
  ): Promise<PaginatedResult<User>> {
    const result = await this.userRepository.findAndCount({
      ...pageable,
      where: { ...userFilterDto }
    });

    return new PaginatedResult(...result);
  }

  /**
   * Hashs password, returns hashed password and salt
   */
  private static async hashPassword(
    password: string
  ): Promise<{ hashedPassword: string; salt: string }> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return { hashedPassword, salt };
  }

  /**
   * Inserts user
   * @param user
   * @returns user
   */
  public async insertUser(insertUserDto: UpsertUserDto): Promise<User> {
    // create user
    const user = new User();
    user.username = insertUserDto.username;
    user.email = insertUserDto.email;
    user.name = insertUserDto.name;
    user.surname = insertUserDto.surname;
    user.enabled = insertUserDto.enabled;
    user.password = FAKE_PSW;
    user.salt = FAKE_SALT;
    user.roles = insertUserDto.roleIds.map((id) => ({ id } as Role));
    user.language = { id: insertUserDto.languageId } as Language;

    // save and return saved user
    const { id } = await this.userRepository.save(user);

    return this.userRepository.findOne({ where: { id } });
  } // insertUser

  /**
   * Edits user
   * @param id
   * @param user
   * @returns user
   */
  public async editUser(id: string, editUserDto: UpsertUserDto): Promise<User> {
    // edit user
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    user.username = editUserDto.username ? editUserDto.username : user.username;
    user.email = editUserDto.email;
    user.name = editUserDto.name;
    user.surname = editUserDto.surname;
    user.enabled = editUserDto.enabled;

    user.roles = editUserDto.roleIds.map((id) => ({ id } as Role));
    user.language = { id: editUserDto.languageId } as Language;

    // save and return saved user
    const savedUser = await this.userRepository.save(user);

    return this.userRepository.findOne({ where: { id: savedUser.id } });
  } // editUserDto
  /**
   *
   * @param user id utente
   * @param refreshToken refresh token
   */

  async getRefreshToken(user: number, refreshToken: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.refreshToken', 'user.refreshTokenExpire'])
      .where(`user.refreshToken = '${refreshToken}'`)
      .andWhere(`user.id = ${user}`)
      .getOne()
      .then((res) => {
        if (!res) throw new Error('No user');
        return res;
      })
      .catch((err) => {
        this.logger.error(`User not found !, data: ${user}`, err.stack);
        throw new Error('User not found !');
      });
  }

  /**
   * Gets user by email
   * @param email
   * @returns user by email
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository
      .findOne({
        where: { email }
      })
      .catch((err) => {
        this.logger.error(err, err.trace);
        throw new InternalServerErrorException();
      });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  /**
   * Saves sys user service
   * @param user
   * @returns save
   */
  async save(user: User): Promise<User> {
    const { id } = await this.userRepository.save(user);
    return this.userRepository.findOne({ where: { id } });
  }
}
