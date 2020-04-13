import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/classes/document';
import { execute } from '~/tasks';

export function upsert(this: Biota, collectionName: string) {
  const self = this;

  return async function upsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update/Insert (${id}) in (${collectionName})`,
          task() {
            return self.query(document.upsert.call(self, collectionName, id, data));
          },
        },
      ],
      {
        domain: 'Biota.collection.upsert',
      },
    );
  };
}
