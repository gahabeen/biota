import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function update(this: Biota, collectionName: string) {
  const self = this;

  return async function updateMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update (${id}) in (${collectionName})`,
          task() {
            return self.query(document(self.context)(collectionName, id).update(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.update',
      },
    );
  };
}
