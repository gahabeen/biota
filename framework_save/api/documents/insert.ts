import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function insert(this: Biota, collectionName: string) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${collectionName}]`,
          task() {
            return self.query(document(self.context)(collectionName, id).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.insert',
      },
    );
  };
}
