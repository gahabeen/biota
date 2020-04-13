import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/classes/collection';
import { execute } from '~/tasks';

export function clean(this: Biota, collectionName: string) {
  const self = this;

  return async function cleanMethod() {
    return execute(
      [
        {
          name: `Clean everything in (${collectionName})`,
          task() {
            return self.query(collection.clean.call(self, collectionName));
          },
        },
      ],
      {
        domain: 'Biota.collection.clean',
      },
    );
  };
}