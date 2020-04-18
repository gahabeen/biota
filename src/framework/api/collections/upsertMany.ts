import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { collections } from '~/factory/api/collections';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkCollectionsApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many collections`,
        task() {
          return self.query(collections(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.collections.upsertMany',
    },
  );
};
