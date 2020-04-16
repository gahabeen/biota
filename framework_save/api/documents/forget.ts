import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function forget(this: Biota, collectionName: string) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget (${id}) in (${collectionName})`,
          task() {
            return self.query(document(self.context)(collectionName, id).forget());
          },
        },
      ],
      {
        domain: 'Biota.collection.forget',
      },
    );
  };
}
