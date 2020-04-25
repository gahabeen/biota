import { FrameworkKeysApi } from '~/types/framework/framework.Keys';
import { keys } from '~/factory/api/Keys';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkKeysApi['dropMany'] = async function (refList) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return execute(
    [
      {
        name: `Drop many Keys`,
        task() {
          return self.query(keys(self.context).dropMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.Keys.dropMany',
    },
  );
};
