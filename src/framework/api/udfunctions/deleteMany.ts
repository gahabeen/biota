import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkKeysApi['deleteMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many keys`,
        task() {
          return self.query(keys(self.context).deleteMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.keys.deleteMany',
    },
  );
};
