import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function delete_(this: Biota, collectionName: string, id: string) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete [${collectionName}/${id}]`,
          task() {
            return self.query(document(self.context)(collectionName, id).delete());
          },
        },
      ],
      {
        domain: 'Biota.document.delete',
      },
    );
  };
}
