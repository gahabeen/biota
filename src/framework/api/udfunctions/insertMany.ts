import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkKeysApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many keys`,
        task() {
          return self.query(keys(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.keys.insertMany',
    },
  );
};
