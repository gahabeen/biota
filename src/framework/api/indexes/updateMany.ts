import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkIndexesApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many indexes`,
        task() {
          return self.query(indexes(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.updateMany',
    },
  );
};
