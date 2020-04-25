import { FrameworkKeysApi } from '~/types/framework/framework.Keys';
import { keys } from '~/factory/api/Keys';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkKeysApi['findAll'] = async function (pagination = {}) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return execute(
    [
      {
        name: `Find all Keys`,
        task() {
          return self.query(keys(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.Keys.findAll',
    },
  );
};
