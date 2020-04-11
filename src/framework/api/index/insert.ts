import { FaunaIndexOptions } from '~/../types/fauna';
import { DB } from '~/db';
import { index } from '~/factory/api/classes/index';
import { execute } from '~/tasks';

export function insert(this: DB, indexName: string) {
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
        domain: 'DB.index.insert',
      },
    );
  };
}
