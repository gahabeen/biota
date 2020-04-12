import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/classes/document';
import { execute } from '~/tasks';

export function repsert(this: Biota, collectionName: string, id: FaunaId) {
  const self = this;

  return async function repsertMethod(data: object) {
    return execute(
      [
        {
          name: `Replace/Insert (${id}) in (${collectionName})`,
          task() {
            return self.query(document.repsert.call(self, collectionName, id, data));
          },
        },
      ],
      {
        domain: 'Biota.document.repsert',
      },
    );
  };
}
