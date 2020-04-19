import { FrameworkUserApi } from './framework.user';

export interface FrameworkCurrentUserApi {
  me: FrameworkUserApi['get'];
  register: FrameworkUserApi['register'];
  registerWithAuthAccount: FrameworkUserApi['registerWithAuthAccount'];
  login: FrameworkUserApi['login'];
  loginWithAuthAccount: FrameworkUserApi['loginWithAuthAccount'];
  logout: FrameworkUserApi['logout'];
  changePassword: FrameworkUserApi['changePassword'];

  activity: FrameworkUserApi['activity'];
  history: FrameworkUserApi['history'];
  update: FrameworkUserApi['update'];
  replace: FrameworkUserApi['replace'];
  delete: FrameworkUserApi['delete'];
  forget: FrameworkUserApi['forget'];
  restore: FrameworkUserApi['restore'];
  remember: FrameworkUserApi['remember'];
}
