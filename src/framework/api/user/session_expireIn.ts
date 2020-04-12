import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';
import { document } from '~/factory/api/classes/document';
import { collectionNameNormalized } from '~/factory/classes/collection';

export async function expireIn(this: Biota, delayInMs: number = 3600) {
  const self = this;
  return execute(
    [
      {
        name: `Expire session in [${delayInMs}]ms`,
        task() {
          return self.query(
            document.expireIn.call(self, collectionNameNormalized('user_sessions'), q.Select('id', q.Identity()), delayInMs),
          );
        },
      },
    ],
    {
      domain: 'Biota.user.session.expireIn',
    },
  );
}
