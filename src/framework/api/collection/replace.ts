import { FaunaId } from '~/types/fauna';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export function replace(this: Biota, collectionName: string) {
  const self = this;

  return async function replaceMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Replace [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).replace(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.replace',
      },
    );
  };
}
