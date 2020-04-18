import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkKeysApi['expireManyAt'] = async function (refList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many keys at ${at}`,
        task() {
          return self.query(keys(self.context).expireManyAt(refList, at));
        },
      },
    ],
    {
      domain: 'Biota.keys.expireManyAt',
    },
  );
};
