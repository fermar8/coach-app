import { UserEntity } from '../users/entities';

interface IAuthResult {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}

export { IAuthResult };
