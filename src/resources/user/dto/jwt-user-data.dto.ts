export interface JWTUserData {
  name: string;
  picture: string;
  iss: string;
  aud: string;
  authTime: number;
  userId: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  emailVerified: boolean;
}
