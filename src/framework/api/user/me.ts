import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { q } from '~/index';
import { Identity } from '~/factory/api/ql';

export async function me(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Get me`,
        task() {
          return self.query(q.Get(Identity()));
        },
      },
    ],
    {
      domain: 'Biota.user.me',
    },
  );
}
