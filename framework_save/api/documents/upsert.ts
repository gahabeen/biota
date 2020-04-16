import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function upsert(this: Biota, collectionName: string) {
  const self = this;

  return async function upsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Update/Insert (${id}) in (${collectionName})`,
          task() {
            return self.query(document(self.context)(collectionName, id).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.upsert',
      },
    );
  };
}
