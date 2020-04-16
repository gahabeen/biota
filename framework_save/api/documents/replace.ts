import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function replace(this: Biota, collectionName: string) {
  const self = this;

  return async function replaceMethod(id: FaunaId, data: object) {
    return execute(
      [
        {
          name: `Replace (${id}) in (${collectionName})`,
          task() {
            return self.query(document(self.context)(collectionName, id).replace(data));
          },
        },
      ],
      {
        domain: 'Biota.collection.replace',
      },
    );
  };
}
