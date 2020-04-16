import { FrameworkCollectionsApi } from 'types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const replaceMany: FrameworkCollectionsApi['replaceMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many collections`,
        task() {
          return self.query(collections(self.context).replaceMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.collections.replaceMany',
    },
  );
};
