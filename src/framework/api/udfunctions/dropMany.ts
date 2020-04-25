import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/UDFunctions';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkUDFunctionsApi['dropMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many UDFunctions`,
        task() {
          return self.query(udfunctions(self.context).dropMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.UDFunctions.dropMany',
    },
  );
};
