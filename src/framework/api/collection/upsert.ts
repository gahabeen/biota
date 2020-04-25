import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export function upsert(this: Biota, collectionName: string) {
  const self = this;

  return async function upsertMethod(data: object) {
    return execute(
      [
        {
          name: `Update/Insert [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.upsert',
      },
    );
  };
}
