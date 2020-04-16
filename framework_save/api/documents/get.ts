import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function get(this: Biota, collectionName: string) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${id}) in (${collectionName})`,
          task() {
            return self.query(document(self.context)(collectionName, id).get());
          },
        },
      ],
      {
        domain: 'Biota.collection.get',
      },
    );
  };
}
