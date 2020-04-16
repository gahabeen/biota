import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export function drop(this: Biota, collectionName: string) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${id}) in (${collectionName})`,
          task() {
            return self.query(document(self.context)(collectionName, id).drop());
          },
        },
      ],
      {
        domain: 'Biota.collection.drop',
      },
    );
  };
}
