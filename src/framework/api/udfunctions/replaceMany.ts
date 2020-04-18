import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const replaceMany: FrameworkKeysApi['replaceMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many keys`,
        task() {
          return self.query(keys(self.context).replaceMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.keys.replaceMany',
    },
  );
};
