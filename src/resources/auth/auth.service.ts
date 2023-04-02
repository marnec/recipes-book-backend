import { Injectable } from '@nestjs/common';
import { getAuth, UserRecord } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  constructor() {}

  async authUserByUid(uid: string): Promise<UserRecord> {
    return getAuth().getUser(uid);
  }
}
