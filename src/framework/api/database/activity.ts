import { FaunaPaginateOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';

export function activity(this: Biota, databaseName: string) {
  const self = this;

  return async (pagination: FaunaPaginateOptions = {}) => {
    return execute(
      [
        {
          name: `Activity for (${databaseName})`,
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
        domain: 'Biota.database.activity',
      },
    );
  };
}
