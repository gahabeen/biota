import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkKeysApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many keys`,
        task() {
          return self.query(keys(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.keys.updateMany',
    },
  );
};
