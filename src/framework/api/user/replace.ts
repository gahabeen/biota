import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { Identity } from '~/factory/api/ql';
import { collectionNameNormalized } from '~/factory/classes/collection';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';

export function replace(this: Biota, data: object) {
  const self = this;
  return execute(
    [
      {
        name: `Replace me`,
        task() {
          return self.document(collectionNameNormalized('users'), q.Select('id', Identity())).replace(data);
        },
      },
    ],
    {
      domain: 'Biota.user.replace',
    },
  );
}
