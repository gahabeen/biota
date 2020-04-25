import { FrameworkKeysApi } from '~/types/framework/framework.Keys';
import { keys } from '~/factory/api/Keys';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkKeysApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many Keys`,
        task() {
          return self.query(keys(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.Keys.upsertMany',
    },
  );
};
