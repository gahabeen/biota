import { Biota } from '~/biota';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';
import { FaunaPaginateOptions } from '~/../types/fauna';

export function all(this: Biota, indexName: string) {
  const self = this;

  return async function allMethod(pagination: FaunaPaginateOptions = {}) {
    return execute(
      [
        {
          name: `All indexes`,
          task() {
            return self.query(index.all.call(self, pagination));
          },
        },
      ],
      {
        domain: 'Biota.index.all',
      },
    );
  };
}
