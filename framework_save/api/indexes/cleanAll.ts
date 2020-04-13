import { Biota } from '~/biota';
import { index } from '~/factory/api/classes/index';
import { execute } from '~/tasks';

export function cleanAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all indexes`,
        task() {
          return self.query(index.cleanAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.indexes.cleanAll',
    },
  );
}
