import { DB } from '~/db';
import { execute } from '~/tasks';
import { q } from '~/index';
import { Identity } from '~/factory/api/ql';

export async function me(this: DB) {
  const self = this;
  return execute(
    [
      {
        name: `Get me`,
        task() {
          return self.query(q.Get(Identity()));
        },
      },
    ],
    {
      domain: 'DB.user.me',
    },
  );
}
