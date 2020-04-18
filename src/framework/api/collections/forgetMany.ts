import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkCollectionsApi['forgetMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many collections`,
        task() {
          return self.query(collections(self.context).forgetMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.collections.forgetMany',
    },
  );
};
