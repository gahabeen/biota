import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function delete_(this: Biota, collectionName: string, id: FaunaId) {
  const self = this;

  return async function deleteMethod() {
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
        domain: 'Biota.document.delete',
      },
    );
  };
}
