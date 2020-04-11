import { DB } from '~/db';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';

export async function get(this: DB) {
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
      domain: 'DB.user.session.get',
    },
  );
}
