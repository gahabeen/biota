import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function get(this: Biota, collectionName: string, id: FaunaId) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${id}) in (${collectionName})`,
          task() {
            return self.query(document.get.call(self, collectionName, id));
          },
        },
      ],
      {
        domain: 'Biota.document.get',
      },
    );
  };
}
