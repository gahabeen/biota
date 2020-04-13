import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/classes/document';
import { execute } from '~/tasks';

export function update(this: Biota, collectionName: string) {
  const self = this;

  return async function updateMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update (${id}) in (${collectionName})`,
          task() {
            return self.query(document.update.call(self, collectionName, id, data));
          },
        },
      ],
      {
        domain: 'Biota.collection.update',
      },
    );
  };
}
