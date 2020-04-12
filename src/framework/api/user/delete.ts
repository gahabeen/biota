import { query as q } from 'faunadb';
import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { Identity } from '~/factory/api/ql';
import { BiotaCollectionName } from '~/factory/classes/collection';
import { execute } from '~/tasks';

export function delete_(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Delete me`,
        task() {
          return self.document(BiotaCollectionName('users'), q.Select('id', Identity())).delete();
        },
      },
    ],
    {
      domain: 'Biota.user.delete',
    },
  );
}
