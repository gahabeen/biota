import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function repsert(this: Biota, collectionName: string) {
  const self = this;

  return async function repsertMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Replace/Insert (${id}) in (${collectionName})`,
          task() {
            return self.query(document(self.context)(collectionName, id).repsert(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.repsert',
      },
    );
  };
}
