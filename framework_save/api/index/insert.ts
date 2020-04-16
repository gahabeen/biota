import { FaunaIndexOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export function insert(this: Biota, indexName: string) {
  const self = this;

  return async function insertMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Insert (${indexName})`,
          task() {
            return self.query(index.insert.call(self, indexName, options));
          },
        },
      ],
      {
        domain: 'Biota.index.insert',
      },
    );
  };
}
