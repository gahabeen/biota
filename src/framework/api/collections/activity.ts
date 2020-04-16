import { FaunaPaginateOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';

export async function activity(this: Biota, pagination: FaunaPaginateOptions = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Activity of collections`,
        async task() {
          return {};
          // return self.database(BiotaCollectionName('actions')).find(
          //   {
          //     database: {
          //       $computed: q.Collection(databaseName),
          //     },
          //   },
          //   pagination,
          // );
        },
      },
    ],
    {
      domain: 'Biota.collections.activity',
    },
  );
}
