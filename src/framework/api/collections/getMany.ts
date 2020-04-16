import { FrameworkCollectionsApi } from 'types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkCollectionsApi['getMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many collections`,
        task() {
          return self.query(collections(self.context).getMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.collections.getMany',
    },
  );
};
