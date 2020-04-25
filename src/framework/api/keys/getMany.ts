import { FrameworkKeysApi } from '~/types/framework/framework.Keys';
import { keys } from '~/factory/api/Keys';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkKeysApi['getMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many Keys`,
        task() {
          return self.query(keys(self.context).getMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.Keys.getMany',
    },
  );
};
