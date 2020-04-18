import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkKeysApi['expireManyIn'] = async function (refList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many keys in ${delay}ms`,
        task() {
          return self.query(keys(self.context).expireManyIn(refList, delay));
        },
      },
    ],
    {
      domain: 'Biota.keys.expireManyIn',
    },
  );
};
