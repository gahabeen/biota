import { FrameworkCurrentUserApi } from '~/types/framework/framework.current.user';

import { currentUserMe } from '~/framework/api/current/user/me';

import { currentUserPasswordChangePassword } from '~/framework/api/current/user/changePassword';
import { currentUserLogin } from '~/framework/api/current/user/login';
import { currentUserLoginWithAuthAccount } from '~/framework/api/current/user/loginWithAuthAccount';
import { currentUserLogout } from '~/framework/api/current/user/logout';
import { currentUserRegister } from '~/framework/api/current/user/register';
import { currentUserRegisterWithAuthAccount } from '~/framework/api/current/user/registerWithAuthAccount';
import { currentUserUpdate } from '~/framework/api/current/user/update';
import { currentUserReplace } from '~/framework/api/current/user/replace';
import { curentUserDelete } from '~/framework/api/current/user/delete';
import { currentUserForget } from '~/framework/api/current/user/forget';
import { currentUserActivity } from '~/framework/api/current/user/activity';
import { currentUserHistory } from '~/framework/api/current/user/history';
import { currentUserRestore } from '~/framework/api/current/user/restore';
import { currentUserRemember } from '~/framework/api/current/user/remember';

export const user: FrameworkCurrentUserApi = {
  me: currentUserMe(),
  login: currentUserLogin(),
  loginWithAuthAccount: currentUserLoginWithAuthAccount(),
  register: currentUserRegister(),
  registerWithAuthAccount: currentUserRegisterWithAuthAccount(),
  changePassword: currentUserPasswordChangePassword(),
  logout: currentUserLogout(),

  update: currentUserUpdate(),
  replace: currentUserReplace(),
  delete: curentUserDelete(),
  forget: currentUserForget(),
  activity: currentUserActivity(),
  history: currentUserHistory(),
  restore: currentUserRestore(),
  remember: currentUserRemember(),

  // google: {
  //   loginUrl: googleLoginUrl,
  //   registerUrl: googleRegisterUrl,
  //   syncUrl: googleSyncUrl,
  //   authenticate: googleAuthenticate,
  // },
};
