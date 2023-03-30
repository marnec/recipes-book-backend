import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Transactional } from 'typeorm-transactional';
import { UserRecipe, UserRole } from './entities/user-recipe.entity';
import { User } from './entities/user.entity';
import { UserRecipeRepository } from './user-recipe.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  
  constructor(
    private userRepository: UserRepository,
    private userRecipeRepository: UserRecipeRepository,
    private authService: AuthService,
    private http: HttpService
  ) {}

  async getByUid(uid: string): Promise<User> {
    return this.userRepository.findOne({ where: { uid } });
  }

  @Transactional()
  async upsertUser(uid: string) {
    const userRecord = await this.authService.authUserByUid(uid);

    const user = await this.getByUid(uid);

    if (!user) {
      return this.createUser(userRecord);
    }

    return user;
  }

  async createUser(userRecord: UserRecord) {
    const { data: image } = await firstValueFrom(
      this.http.get<ArrayBuffer>(userRecord.photoURL, {
        responseType: 'arraybuffer'
      })
    );

    const user = this.userRepository.create({
      uid: userRecord.uid,
      email: userRecord.email,
      userName: userRecord.displayName,
      avatar: Buffer.from(image).toString('base64')
    });

    return this.userRepository.save(user);
  }

  associateToRecipe(userId: string, recipeId: string, role: UserRole): Promise<UserRecipe> {
    const userRecipe = this.userRecipeRepository.create({
      userId,
      recipeId,
      role
    });

    return this.userRecipeRepository.save(userRecipe);
  }

  async dissociateFromRecipe(recipeId: string) {
    await this.userRecipeRepository.delete({ recipeId });
  }
}
