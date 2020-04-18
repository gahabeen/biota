import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkIndexesApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many indexes`,
        task() {
          return self.query(indexes(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.upsertMany',
    },
  );
};
