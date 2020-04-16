import { Biota } from '~/biota';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export function get(this: Biota, indexName: string) {
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
        domain: 'Biota.index.get',
      },
    );
  };
}
