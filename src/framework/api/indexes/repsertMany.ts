import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const repsertMany: FrameworkIndexesApi['repsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many indexes`,
        task() {
          return self.query(indexes(self.context).repsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.indexes.repsertMany',
    },
  );
};
