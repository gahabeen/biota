import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkKeysApi['restoreMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many keys`,
        task() {
          return self.query(keys(self.context).restoreMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.keys.restoreMany',
    },
  );
};
