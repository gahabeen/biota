import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export function update(this: Biota, collectionName: string) {
  const self = this;

  return async function updateMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).update(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.update',
      },
    );
  };
}
