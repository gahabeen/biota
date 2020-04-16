import { FactoryCollection } from 'types/factory/factory.collection';
import { FrameworkCollectionApi } from 'types/framework/framework.collection';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export const expireAt: FactoryCollection<FrameworkCollectionApi['expireAt']> = function (collectionName) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${collectionName}] at ${at}`,
          task() {
            return self.query(collection(self.context)(collectionName).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.collection.expireAt',
      },
    );
  };
};
