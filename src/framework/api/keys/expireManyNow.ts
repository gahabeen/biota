import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkUDFunctionsApi['expireManyNow'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many udfunctions now`,
        task() {
          return self.query(udfunctions(self.context).expireManyNow(refList));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.expireManyNow',
    },
  );
};
