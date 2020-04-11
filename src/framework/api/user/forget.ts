import { query as q } from 'faunadb';
import { FaunaId } from '~/../types/fauna';
import { DB } from '~/db';
import { Identity } from '~/factory/api/ql';
import { collectionNameNormalized } from '~/factory/classes/collection';
import { execute } from '~/tasks';

export function forget(this: DB) {
  const self = this;
  return execute(
    [
      {
        name: `Forget me`,
        task() {
          return self.document(collectionNameNormalized('users'), q.Select('id', Identity())).forget();
        },
      },
    ],
    {
      domain: 'DB.user.forget',
    },
  );
}
