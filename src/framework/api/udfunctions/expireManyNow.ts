import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkKeysApi['expireManyNow'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many keys now`,
        task() {
          return self.query(keys(self.context).expireManyNow(refList));
        },
      },
    ],
    {
      domain: 'Biota.keys.expireManyNow',
    },
  );
};
