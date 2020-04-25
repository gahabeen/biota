import { FrameworkKeysApi } from '~/types/framework/framework.Keys';
import { keys } from '~/factory/api/Keys';
import { execute } from '~/tools/tasks';

export const replaceMany: FrameworkKeysApi['replaceMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many Keys`,
        task() {
          return self.query(keys(self.context).replaceMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.Keys.replaceMany',
    },
  );
};
