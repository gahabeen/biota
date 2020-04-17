import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkIndexesApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many indexes`,
        task() {
          return self.query(indexes(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.insertMany',
    },
  );
};
