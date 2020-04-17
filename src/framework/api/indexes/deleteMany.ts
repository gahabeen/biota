import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkIndexesApi['deleteMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many indexes`,
        task() {
          return self.query(indexes(self.context).deleteMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.deleteMany',
    },
  );
};
