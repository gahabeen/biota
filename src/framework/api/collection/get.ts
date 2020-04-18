import { FaunaId } from '~/types/fauna';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export function get(this: Biota, collectionName: string) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).get());
          },
        },
      ],
      {
        domain: 'Biota.collection.get',
      },
    );
  };
}
