import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkCollectionsApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many collections`,
        task() {
          return self.query(collections(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.collections.updateMany',
    },
  );
};
