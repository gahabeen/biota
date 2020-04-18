import { FaunaId } from '~/types/fauna';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export function forget(this: Biota, collectionName: string) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).forget());
          },
        },
      ],
      {
        domain: 'Biota.collection.forget',
      },
    );
  };
}
