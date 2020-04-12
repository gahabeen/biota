import { DocumentAuthAccount } from 'types/document';
import { Biota } from '~/biota';
import { user } from '~/factory/api/call/user';
import { execute } from '~/tasks';

export function loginWithAuthAccount(this: Biota, account: DocumentAuthAccount) {
  const self = this;
  return execute(
    [
      {
        name: `Register with auth account [${account.provider}]`,
        task() {
          return self.query(user.loginWithAuthAccount.call(self, account));
        },
      },
    ],
    {
      domain: 'Biota.user.loginWithAuthAccount',
    },
  );
}
