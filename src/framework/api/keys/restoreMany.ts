import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkUDFunctionsApi['restoreMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many udfunctions`,
        task() {
          return self.query(udfunctions(self.context).restoreMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.restoreMany',
    },
  );
};
