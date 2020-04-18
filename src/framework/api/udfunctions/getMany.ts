import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkKeysApi['getMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many keys`,
        task() {
          return self.query(keys(self.context).getMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.keys.getMany',
    },
  );
};
