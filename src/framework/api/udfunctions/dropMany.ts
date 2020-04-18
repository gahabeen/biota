import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkKeysApi['dropMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many keys`,
        task() {
          return self.query(keys(self.context).dropMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.keys.dropMany',
    },
  );
};
