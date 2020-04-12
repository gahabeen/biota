import { FaunaIndexOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { index } from '~/factory/api/classes/index';
import { execute } from '~/tasks';

export function upsert(this: Biota, indexName: string) {
  const self = this;

  return async function upsertMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Upsert (${indexName})`,
          task() {
            return self.query(index.upsert.call(self, indexName, options));
          },
        },
      ],
      {
        domain: 'Biota.index.upsert',
      },
    );
  };
}
