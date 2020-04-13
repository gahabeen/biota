import { FaunaIndexOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { index } from '~/factory/api/classes/index';
import { execute } from '~/tasks';

export function delete_(this: Biota, indexName: string) {
  const self = this;

  return async function deleteMethod() {
    return execute(
      [
        {
          name: `Delete (${indexName})`,
          task() {
            return self.query(index.delete.call(self, indexName));
          },
        },
      ],
      {
        domain: 'Biota.index.delete',
      },
    );
  };
}