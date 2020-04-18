import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkCollectionsApi['dropMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many collections`,
        task() {
          return self.query(collections(self.context).dropMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.collections.dropMany',
    },
  );
};
