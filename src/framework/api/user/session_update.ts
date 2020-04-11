import { DB } from '~/db';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';
import { document } from '~/factory/api/classes/document';
import { collectionNameNormalized } from '~/factory/classes/collection';

export async function update(this: DB, data = {}) {
  const self = this;
  return execute(
    [
      {
        name: `Update session data`,
        task() {
          return self.query(document.update.call(self, collectionNameNormalized('user_sessions'), q.Select('id', q.Identity()), data));
        },
      },
    ],
    {
      domain: 'DB.user.session.update',
    },
  );
}
