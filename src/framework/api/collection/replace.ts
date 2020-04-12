import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/classes/document';
import { execute } from '~/tasks';

export function replace(this: Biota, collectionName: string) {
  const self = this;

  return async function replaceMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Replace (${id}) in (${collectionName})`,
          task() {
            return self.query(document.replace.call(self, collectionName, id, data));
          },
        },
      ],
      {
        domain: 'Biota.collection.replace',
      },
    );
  };
}
