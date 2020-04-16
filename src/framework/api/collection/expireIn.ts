import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';
import { FrameworkCollectionApi } from 'types/framework/framework.collection';
import { FactoryCollection } from 'types/factory/factory.collection';

export const expireIn: FactoryCollection<FrameworkCollectionApi['expireIn']> = function (collectionName) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${collectionName}] delayd of ${delay}ms`,
          task() {
            return self.query(collection(self.context)(collectionName).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.collection.expireIn',
      },
    );
  };
};
