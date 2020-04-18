import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkUDFunctionsApi['forgetMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many udfunctions`,
        task() {
          return self.query(udfunctions(self.context).forgetMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.forgetMany',
    },
  );
};
