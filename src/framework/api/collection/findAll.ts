import { FaunaPaginateOptions, FaunaPaginateMapper } from '~/../types/fauna';
import { DB } from '~/db';
import { execute } from '~/tasks';
import { query as q } from 'faunadb';

export function findAll(this: DB, collectionName: string) {
  const self = this;

  return async function findAllMethod(pagination: FaunaPaginateOptions = {}, mapper: FaunaPaginateMapper = (x) => q.Get(x)) {
    return execute(
      [
        {
          name: `Find all documents in (${collectionName})`,
          task() {
            return self.query(q.Map(q.Paginate(q.Documents(q.Collection(collectionName)), pagination), mapper));
          },
        },
      ],
      {
        domain: 'DB.collection.findAll',
      },
    );
  };
}
