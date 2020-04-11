import { DBFrameworkUserApi } from '~/../types/framework/framework.user';
import { changePassword } from '~/framework/api/user/changePassword';
import { googleLoginUrl } from '~/framework/api/user/google_loginUrl';
import { googleRegisterUrl } from '~/framework/api/user/google_registerUrl';
import { googleSyncUrl } from '~/framework/api/user/google_syncUrl';
import { googleAuthenticate } from '~/framework/api/user/google_authenticate';
import { login } from '~/framework/api/user/login';
import { loginWithAuthAccount } from '~/framework/api/user/loginWithAuthAccount';
import { logout } from '~/framework/api/user/logout';
import { me } from '~/framework/api/user/me';
import { register } from '~/framework/api/user/register';
import { registerWithAuthAccount } from '~/framework/api/user/registerWithAuthAccount';
import { delete_ as deleteSession } from '~/framework/api/user/session_delete';
import { expireAt as expireAtSession } from '~/framework/api/user/session_expireAt';
import { expireIn as expireInSession } from '~/framework/api/user/session_expireIn';
import { expireNow as expireNowSession } from '~/framework/api/user/session_expireNow';
import { forget as forgetSession } from '~/framework/api/user/session_forget';
import { get as getSession } from '~/framework/api/user/session_get';
import { replace as replaceSession } from '~/framework/api/user/session_replace';
import { update as updateSession } from '~/framework/api/user/session_update';
import { update } from '~/framework/api/user/update';
import { replace } from '~/framework/api/user/replace';
import { delete_ } from '~/framework/api/user/delete';
import { forget } from '~/framework/api/user/forget';
import { activity } from '~/framework/api/user/activity';

export const user: DBFrameworkUserApi = {
  me,
  login,
  loginWithAuthAccount,
  register,
  registerWithAuthAccount,
  changePassword,
  logout,

  update,
  replace,
  delete: delete_,
  forget,
  activity,

  session: {
    get: getSession,
    expireNow: expireNowSession,
    expireIn: expireInSession,
    expireAt: expireAtSession,
    delete: deleteSession,
    update: updateSession,
    replace: replaceSession,
    forget: forgetSession,
  },
  google: {
    loginUrl: googleLoginUrl,
    registerUrl: googleRegisterUrl,
    syncUrl: googleSyncUrl,
    authenticate: googleAuthenticate,
  },
  // github: {
  //   async loginUrl() {
  //     return '';
  //   },
  //   async registerUrl() {
  //     return '';
  //   },
  //   async syncUrl() {
  //     return '';
  //   },
  //   async authenticate() {},
  // },
};
