import { FrameworkKeysApi } from '~/types/framework/framework.Keys';
import { keys } from '~/factory/api/Keys';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkKeysApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many Keys`,
        task() {
          return self.query(keys(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.Keys.insertMany',
    },
  );
};
