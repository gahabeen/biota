import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { query as q } from 'faunadb';
import { document } from '~/factory/api/document';
import { BiotaCollectionName } from '~/factory/constructors/collection';

export async function delete_(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Delete session`,
        task() {
          return self.query(document.delete.call(self, BiotaCollectionName('user_sessions'), q.Select('id', q.Identity())));
        },
      },
    ],
    {
      domain: 'Biota.user.session.delete',
    },
  );
}
