import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';
import { document } from '~/factory/api/classes/document';
import { BiotaCollectionName } from '~/factory/classes/collection';

export async function forget(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Forget session`,
        task() {
          return self.query(document.forget.call(self, BiotaCollectionName('user_sessions'), q.Select('id', q.Identity())));
        },
      },
    ],
    {
      domain: 'Biota.user.session.forget',
    },
  );
}
