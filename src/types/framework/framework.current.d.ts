import { FrameworkCurrentUserApi } from './framework.current.user';

export interface FrameworkCurrentSessionsApi {
  _empty: string;
}

export interface FrameworkCurrentApi {
  user: FrameworkCurrentUserApi;
  session: FrameworkCurrentSessionsApi;
}
