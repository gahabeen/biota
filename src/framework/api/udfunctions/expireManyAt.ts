import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/UDFunctions';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkUDFunctionsApi['expireManyAt'] = async function (refList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many UDFunctions at ${at}`,
        task() {
          return self.query(udfunctions(self.context).expireManyAt(refList, at));
        },
      },
    ],
    {
      domain: 'Biota.UDFunctions.expireManyAt',
    },
  );
};
