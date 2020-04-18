import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkKeysApi['forgetMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many keys`,
        task() {
          return self.query(keys(self.context).forgetMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.keys.forgetMany',
    },
  );
};
