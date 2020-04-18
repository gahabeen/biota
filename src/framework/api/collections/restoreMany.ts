import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkCollectionsApi['restoreMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many collections`,
        task() {
          return self.query(collections(self.context).restoreMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.collections.restoreMany',
    },
  );
};
