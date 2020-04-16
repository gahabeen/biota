import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export function delete_(this: Biota, collectionName: string) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).delete());
          },
        },
      ],
      {
        domain: 'Biota.collection.delete',
      },
    );
  };
}
