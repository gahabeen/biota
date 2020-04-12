import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';

export async function get(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Get session`,
        task() {
          return self.query(q.Get(q.Identity()));
        },
      },
    ],
    {
      domain: 'Biota.user.session.get',
    },
  );
}
