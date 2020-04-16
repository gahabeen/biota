import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export function drop(this: Biota, collectionName: string) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).drop());
          },
        },
      ],
      {
        domain: 'Biota.collection.drop',
      },
    );
  };
}
