import { FrameworkCollectionsApi } from 'types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkCollectionsApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many collections`,
        task() {
          return self.query(collections(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.collections.insertMany',
    },
  );
};
