import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/UDFunctions';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkUDFunctionsApi['restoreMany'] = async function (refList) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return execute(
    [
      {
        name: `Restore many UDFunctions`,
        task() {
          return self.query(udfunctions(self.context).restoreMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.UDFunctions.restoreMany',
    },
  );
};
