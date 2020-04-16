import { FaunaPaginateOptions, FaunaPaginateMapper } from '~/../types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { query as q } from 'faunadb';
import { collection } from '~/factory/api/collection';

export function findAll(this: Biota, collectionName: string) {
  const self = this;

  return async (pagination: FaunaPaginateOptions = {}) => {
    return execute(
      [
        {
          name: `Find all documents in (${collectionName})`,
          task() {
            return self.query(collection(self.context)(collectionName).findAll(pagination));
          },
        },
      ],
      {
        domain: 'Biota.collection.findAll',
      },
    );
  };
}
