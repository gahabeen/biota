import { FaunaIndexOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { index } from '~/factory/api/classes/index';
import { execute } from '~/tasks';

export function forget(this: Biota, indexName: string) {
  const self = this;

  return async function forgetMethod() {
    return execute(
      [
        {
          name: `Forget (${indexName})`,
          task() {
            return self.query(index.forget(indexName));
          },
        },
      ],
      {
        domain: 'Biota.index.forget',
      },
    );
  };
}
