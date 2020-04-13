import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';
import { document } from '~/factory/api/classes/document';
import { BiotaCollectionName } from '~/factory/constructors/collection';

export async function expireNow(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Expire session now`,
        task() {
          return self.query(document.expireNow.call(self, BiotaCollectionName('user_sessions'), q.Select('id', q.Identity())));
        },
      },
    ],
    {
      domain: 'Biota.user.session.expireNow',
    },
  );
}
