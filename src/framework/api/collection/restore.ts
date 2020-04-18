import { FactoryCollection } from '~/types/factory/factory.collection';
import { FrameworkCollectionApi } from '~/types/framework/framework.collection';
import { Biota } from '~/biota';
import { collection } from '~/factory/api/collection';
import { execute } from '~/tools/tasks';

export const restore: FactoryCollection<FrameworkCollectionApi['restore']> = function (this: Biota, collectionName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${collectionName}]`,
          task() {
            return self.query(collection(self.context)(collectionName).restore());
          },
        },
      ],
      {
        domain: 'Biota.collection.restore',
      },
    );
  };
};
