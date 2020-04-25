import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/UDFunctions';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkUDFunctionsApi['getMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many UDFunctions`,
        task() {
          return self.query(udfunctions(self.context).getMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.UDFunctions.getMany',
    },
  );
};
