import { FactoryDatabase } from '~/types/factory/factory.database';
import { FrameworkDatabaseApi } from '~/types/framework/framework.database';
import { execute } from '~/tools/tasks';

export const activity: FactoryDatabase<FrameworkDatabaseApi['activity']> = function (databaseName) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity [${databaseName}]`,
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
};
