import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkKeysApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all keys`,
        task() {
          return self.query(keys(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.keys.findAll',
    },
  );
};
