import { FrameworkUser } from '~/types/framework/framework.user';
import { activity } from '~/framework/api/user/activity';
import { delete_ } from '~/framework/api/user/delete';
import { drop } from '~/framework/api/user/drop';
import { expireAt } from '~/framework/api/user/expireAt';
import { expireIn } from '~/framework/api/user/expireIn';
import { expireNow } from '~/framework/api/user/expireNow';
import { forget } from '~/framework/api/user/forget';
import { get } from '~/framework/api/user/get';
import { insert } from '~/framework/api/user/insert';
import { replace } from '~/framework/api/user/replace';
import { repsert } from '~/framework/api/user/repsert';
import { restore } from '~/framework/api/user/restore';
import { remember } from '~/framework/api/user/remember';
import { update } from '~/framework/api/user/update';
import { upsert } from '~/framework/api/user/upsert';
import { history } from '~/framework/api/user/history';
import { register } from '~/framework/api/user/register';
import { registerWithAuthAccount } from '~/framework/api/user/registerWithAuthAccount';
import { login } from '~/framework/api/user/login';
import { loginWithAuthAccount } from '~/framework/api/user/loginWithAuthAccount';
import { logout } from '~/framework/api/user/logout';
import { changePassword } from '~/framework/api/user/changePassword';
import { authAccountSet } from '~/framework/api/user/auth_account_set';
import { authAccountRemove } from '~/framework/api/user/auth_account_remove';
import { authAccountDistinct } from '~/framework/api/user/auth_account_distinct';
import { authAccountDifference } from '~/framework/api/user/auth_account_difference';
import { authEmailSet } from '~/framework/api/user/auth_email_set';
import { authEmailRemove } from '~/framework/api/user/auth_email_remove';

import { authGoogleLoginUrl } from '~/framework/api/user/auth_google_loginUrl';
import { authGoogleRegisterUrl } from '~/framework/api/user/auth_google_registerUrl';
import { authGoogleSyncUrl } from '~/framework/api/user/auth_google_syncUrl';
import { authGoogleAuthenticate } from '~/framework/api/user/auth_google_authenticate';

export const user: FrameworkUser = function (id = null) {
  const self = this;

  return {
    register: register.call(self, id),
    registerWithAuthAccount: registerWithAuthAccount.call(self, id),
    login: login.call(self, id),
    loginWithAuthAccount: loginWithAuthAccount.call(self, id),
    logout: logout.call(self, id),
    changePassword: changePassword.call(self, id),
    auth: {
      google: {
        loginUrl: authGoogleLoginUrl.call(self, id),
        registerUrl: authGoogleRegisterUrl.call(self, id),
        syncUrl: authGoogleSyncUrl.call(self, id),
        authenticate: authGoogleAuthenticate.call(self, id),
      },
      account: {
        set: authAccountSet.call(self, id),
        remove: authAccountRemove.call(self, id),
        distinct: authAccountDistinct.call(self, id),
        difference: authAccountDifference.call(self, id),
      },
      email: {
        set: authEmailSet.call(self, id),
        remove: authEmailRemove.call(self, id),
      },
    },
    activity: activity.call(self, id),
    history: history.call(self, id),
    get: get.call(self, id),
    insert: insert.call(self, id),
    replace: replace.call(self, id),
    update: update.call(self, id),
    repsert: repsert.call(self, id),
    upsert: upsert.call(self, id),
    delete: delete_.call(self, id),
    forget: forget.call(self, id),
    drop: drop.call(self, id),
    restore: restore.call(self, id),
    remember: remember.call(self, id),
    expireAt: expireAt.call(self, id),
    expireIn: expireIn.call(self, id),
    expireNow: expireNow.call(self, id),
  };
};
