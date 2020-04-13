import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';
import { document } from '~/factory/api/classes/document';
import { BiotaCollectionName } from '~/factory/constructors/collection';

export async function update(this: Biota, data = {}) {
  const self = this;
  return execute(
    [
      {
        name: `Update session data`,
        task() {
          return self.query(document.update.call(self, BiotaCollectionName('user_sessions'), q.Select('id', q.Identity()), data));
        },
      },
    ],
    {
      domain: 'Biota.user.session.update',
    },
  );
}
