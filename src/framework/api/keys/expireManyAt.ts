import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkUDFunctionsApi['expireManyAt'] = async function (refList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many udfunctions at ${at}`,
        task() {
          return self.query(udfunctions(self.context).expireManyAt(refList, at));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.expireManyAt',
    },
  );
};
