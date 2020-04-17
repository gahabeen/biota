import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkIndexesApi['forgetMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many indexes`,
        task() {
          return self.query(indexes(self.context).forgetMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.forgetMany',
    },
  );
};
