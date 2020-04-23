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
import { inputStringLiteral } from '~/helpers/literals';

export const user: FrameworkUser = function (...args) {
  const [id] = inputStringLiteral(args);

  return {
    register: register.call(this, id),
    registerWithAuthAccount: registerWithAuthAccount.call(this, id),
    login: login.call(this, id),
    loginWithAuthAccount: loginWithAuthAccount.call(this, id),
    logout: logout.call(this, id),
    changePassword: changePassword.call(this, id),
    auth: {
      google: {
        loginUrl: authGoogleLoginUrl.call(this, id),
        registerUrl: authGoogleRegisterUrl.call(this, id),
        syncUrl: authGoogleSyncUrl.call(this, id),
        authenticate: authGoogleAuthenticate.call(this, id),
      },
      account: {
        set: authAccountSet.call(this, id),
        remove: authAccountRemove.call(this, id),
        distinct: authAccountDistinct.call(this, id),
        difference: authAccountDifference.call(this, id),
      },
      email: {
        set: authEmailSet.call(this, id),
        remove: authEmailRemove.call(this, id),
      },
    },
    activity: activity.call(this, id),
    history: history.call(this, id),
    get: get.call(this, id),
    insert: insert.call(this, id),
    replace: replace.call(this, id),
    update: update.call(this, id),
    repsert: repsert.call(this, id),
    upsert: upsert.call(this, id),
    delete: delete_.call(this, id),
    forget: forget.call(this, id),
    drop: drop.call(this, id),
    restore: restore.call(this, id),
    remember: remember.call(this, id),
    expireAt: expireAt.call(this, id),
    expireIn: expireIn.call(this, id),
    expireNow: expireNow.call(this, id),
  };
};
