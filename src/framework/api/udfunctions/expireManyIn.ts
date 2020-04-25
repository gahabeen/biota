import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/UDFunctions';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkUDFunctionsApi['expireManyIn'] = async function (refList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many UDFunctions in ${delay}ms`,
        task() {
          return self.query(udfunctions(self.context).expireManyIn(refList, delay));
        },
      },
    ],
    {
      domain: 'Biota.UDFunctions.expireManyIn',
    },
  );
};
