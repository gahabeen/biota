import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/classes/document';
import { execute } from '~/tasks';

export function replace(this: Biota, collectionName: string, id: FaunaId) {
  const self = this;

  return async function replaceMethod(data: object) {
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
        domain: 'Biota.document.replace',
      },
    );
  };
}
