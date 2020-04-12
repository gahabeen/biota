import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';
import { document } from '~/factory/api/classes/document';
import { BiotaCollectionName } from '~/factory/classes/collection';

export async function replace(this: Biota, data = {}) {
  const self = this;
  return execute(
    [
      {
        name: `Replace session data`,
        task() {
          return self.query(document.replace.call(self, BiotaCollectionName('user_sessions'), q.Select('id', q.Identity()), data));
        },
      },
    ],
    {
      domain: 'Biota.user.session.replace',
    },
  );
}
