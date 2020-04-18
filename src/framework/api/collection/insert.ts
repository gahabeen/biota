import { FaunaId } from '~/types/fauna';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export function insert(this: Biota, collectionName: string) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.insert',
      },
    );
  };
}
