import { FrameworkKeysApi } from '~/types/framework/framework.keys';
import { keys } from '~/factory/api/keys';
import { execute } from '~/tools/tasks';

export const repsertMany: FrameworkKeysApi['repsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many keys`,
        task() {
          return self.query(keys(self.context).repsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.keys.repsertMany',
    },
  );
};
