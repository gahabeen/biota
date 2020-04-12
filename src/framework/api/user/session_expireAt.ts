import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';
import { document } from '~/factory/api/classes/document';
import { BiotaCollectionName } from '~/factory/classes/collection';

export async function expireAt(this: Biota, at: any) {
  const self = this;
  return execute(
    [
      {
        name: `Expire session at [${at}]`,
        task() {
          return self.query(document.expireAt.call(self, BiotaCollectionName('user_sessions'), q.Select('id', q.Identity()), at));
        },
      },
    ],
    {
      domain: 'Biota.user.session.expireAt',
    },
  );
}
