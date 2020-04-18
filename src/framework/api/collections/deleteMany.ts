import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkCollectionsApi['deleteMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many collections`,
        task() {
          return self.query(collections(self.context).deleteMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.collections.deleteMany',
    },
  );
};
