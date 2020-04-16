import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export function repsert(this: Biota, collectionName: string) {
  const self = this;

  return async function repsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Replace/Insert [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).repsert(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.repsert',
      },
    );
  };
}
