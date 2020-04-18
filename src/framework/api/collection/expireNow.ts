import { FactoryCollection } from '~/types/factory/factory.collection';
import { FrameworkCollectionApi } from '~/types/framework/framework.collection';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export const expireNow: FactoryCollection<FrameworkCollectionApi['expireNow']> = function (collectionName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${collectionName}] now`,
          task() {
            return self.query(collection(self.context)(collectionName).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.collection.expireNow',
      },
    );
  };
};
