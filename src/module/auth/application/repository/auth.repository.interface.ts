import { Auth } from '../../domain/auth.entity';

export interface IAuthRepository {
  saveRefreshToken(session: Auth): Promise<Auth>;
  removeRefreshToken(token: string): Promise<void>;
}
