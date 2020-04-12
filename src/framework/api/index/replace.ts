import { FaunaIndexOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { index } from '~/factory/api/classes/index';
import { execute } from '~/tasks';

export function replace(this: Biota, indexName: string) {
  const self = this;

  return async function replaceMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Update (${indexName})`,
          task() {
            return self.query(index.replace.call(self, indexName, options));
          },
        },
      ],
      {
        domain: 'Biota.index.replace',
      },
    );
  };
}
