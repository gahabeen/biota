import { FaunaIndexOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export function repsert(this: Biota, indexName: string) {
  const self = this;

  return async function repsertMethod(options: FaunaIndexOptions) {
    return execute(
      [
        {
          name: `Repsert (${indexName})`,
          task() {
            return self.query(index.repsert.call(self, indexName, options));
          },
        },
      ],
      {
        domain: 'Biota.index.repsert',
      },
    );
  };
}
