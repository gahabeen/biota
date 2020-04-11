import { query as q } from 'faunadb';
import { DBFactoryCallUser } from '~/../types/factory/factory.call';
import { Identity } from '~/factory/api/ql';
import { udfunctionNameNormalized as udfName } from '~/factory/classes/udfunction';
import { DB } from '~/db';

export const user: DBFactoryCallUser = {
  login(this: DB, email, password) {
    return q.Call(udfName('UserLogin'), Identity(), this.private_key, email, password);
  },
  loginWithAuthAccount(this: DB, account) {
    return q.Call(udfName('UserLoginWithAuthAccount'), Identity(), this.private_key, account || {});
  },
  logout(this: DB, everywhere) {
    return q.Call(udfName('UserLogout'), Identity(), this.private_key, everywhere);
  },
  register(this: DB, email, password, data = {}) {
    return q.Call(udfName('UserRegister'), Identity(), this.private_key, email, password, data);
  },
  registerWithAuthAccount(this: DB, account) {
    return q.Call(udfName('UserRegisterWithAuthAccount'), Identity(), this.private_key, account || {});
  },
  changePassword(this: DB, newPassword) {
    return q.Call(udfName('UserChangePassword'), Identity(), this.private_key, newPassword);
  },
};
