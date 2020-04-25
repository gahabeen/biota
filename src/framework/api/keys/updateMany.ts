import { FrameworkKeysApi } from '~/types/framework/framework.Keys';
import { keys } from '~/factory/api/Keys';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkKeysApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many Keys`,
        task() {
          return self.query(keys(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.Keys.updateMany',
    },
  );
};
