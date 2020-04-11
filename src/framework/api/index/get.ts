import { DB } from '~/db';
import { index } from '~/factory/api/classes/index';
import { execute } from '~/tasks';

export function get(this: DB, indexName: string) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${indexName})`,
          task() {
            return self.query(index.get.call(self, indexName));
          },
        },
      ],
      {
        domain: 'DB.index.get',
      },
    );
  };
}
