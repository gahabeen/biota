import { FaunaId, FaunaDocumentOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/classes/document';
import { execute } from '~/tasks';

export function insert(this: Biota, collectionName: string) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${collectionName}]`,
          task() {
            return self.query(document.insert.call(self, collectionName, data, id));
          },
        },
      ],
      {
        domain: 'Biota.collection.insert',
      },
    );
  };
}
