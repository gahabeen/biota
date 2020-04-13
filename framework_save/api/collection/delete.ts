import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/classes/document';
import { execute } from '~/tasks';

export function delete_(this: Biota, collectionName: string) {
  const self = this;

  return async function deleteMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Delete (${id}) in (${collectionName})`,
          task() {
            return self.query(document.delete.call(self, collectionName, id));
          },
        },
      ],
      {
        domain: 'Biota.collection.delete',
      },
    );
  };
}