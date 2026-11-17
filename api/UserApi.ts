import { BaseApiClient } from './BaseApiClient';
import { ApiMessage, ApiResult, UserAccount, UserDetailResponse } from './types';

export class UserApi extends BaseApiClient {
  createAccount(user: UserAccount): Promise<ApiResult<ApiMessage>> {
    return this.post<ApiMessage>('createAccount', user);
  }

  verifyLogin(email: string, password: string): Promise<ApiResult<ApiMessage>> {
    return this.post<ApiMessage>('verifyLogin', { email, password });
  }

  /** Calls verifyLogin without any parameters — used for negative tests. */
  verifyLoginWithoutCredentials(): Promise<ApiResult<ApiMessage>> {
    return this.post<ApiMessage>('verifyLogin');
  }

  getUserByEmail(email: string): Promise<ApiResult<UserDetailResponse>> {
    return this.get<UserDetailResponse>('getUserDetailByEmail', { email });
  }

  deleteAccount(email: string, password: string): Promise<ApiResult<ApiMessage>> {
    return this.delete<ApiMessage>('deleteAccount', { email, password });
  }
}
