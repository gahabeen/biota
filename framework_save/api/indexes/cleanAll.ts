import { Biota } from '~/biota';
import { index } from '~/factory/api/classes/index';
import { execute } from '~/tasks';

export function dropAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all indexes`,
        task() {
          return self.query(index.dropAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.indexes.dropAll',
    },
  );
}
