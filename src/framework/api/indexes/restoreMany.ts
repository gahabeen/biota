import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkIndexesApi['restoreMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many indexes`,
        task() {
          return self.query(indexes(self.context).restoreMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.restoreMany',
    },
  );
};
