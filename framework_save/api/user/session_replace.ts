import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { query as q } from 'faunadb';
import { document } from '~/factory/api/document';
import { BiotaCollectionName } from '~/factory/constructors/collection';

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
