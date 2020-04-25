import { FrameworkKeysApi } from '~/types/framework/framework.Keys';
import { keys } from '~/factory/api/Keys';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkKeysApi['forgetMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many Keys`,
        task() {
          return self.query(keys(self.context).forgetMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.Keys.forgetMany',
    },
  );
};
