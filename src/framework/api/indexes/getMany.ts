import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkIndexesApi['getMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many indexes`,
        task() {
          return self.query(indexes(self.context).getMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.getMany',
    },
  );
};
