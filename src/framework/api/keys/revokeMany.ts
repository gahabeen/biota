import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const revokeMany: FrameworkKeysApi['revokeMany'] = async function (refList) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return execute(
    [
      {
        name: `Revoke many keys`,
        task() {
          return self.query(keys(self.context).revokeMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.keys.revokeMany',
    },
  );
};
