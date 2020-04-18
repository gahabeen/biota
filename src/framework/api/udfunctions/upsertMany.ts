import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkKeysApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many keys`,
        task() {
          return self.query(keys(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.keys.upsertMany',
    },
  );
};
