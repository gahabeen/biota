import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkIndexesApi['dropMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many indexes`,
        task() {
          return self.query(indexes(self.context).dropMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.dropMany',
    },
  );
};
