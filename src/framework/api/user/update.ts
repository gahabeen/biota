import { query as q } from 'faunadb';
import { DB } from '~/db';
import { document } from '~/factory/api/classes/document';
import { Identity } from '~/factory/api/ql';
import { collectionNameNormalized } from '~/factory/classes/collection';
import { execute } from '~/tasks';

export function update(this: DB, data: object) {
  const self = this;
  return execute(
    [
      {
        name: `Update me`,
        async task() {
          return self.query(document.update.call(self, collectionNameNormalized('users'), q.Select('id', Identity()), data));
        },
      },
    ],
    {
      domain: 'DB.user.update',
    },
  );
}
