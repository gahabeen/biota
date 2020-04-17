import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const replaceMany: FrameworkIndexesApi['replaceMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many indexes`,
        task() {
          return self.query(indexes(self.context).replaceMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.replaceMany',
    },
  );
};
