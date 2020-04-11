import { DocumentAuthAccount } from 'types/document';
import { DB } from '~/db';
import { user } from '~/factory/api/call/user';
import { execute } from '~/tasks';

export function registerWithAuthAccount(this: DB, account: DocumentAuthAccount) {
  const self = this;
  return execute(
    [
      {
        name: `Register with auth account [${account.provider}]`,
        task() {
          return self.query(user.registerWithAuthAccount.call(self, account));
        },
      },
    ],
    {
      domain: 'DB.user.registerWithAuthAccount',
    },
  );
}
