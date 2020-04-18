import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkUDFunctionsApi['dropMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many udfunctions`,
        task() {
          return self.query(udfunctions(self.context).dropMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.dropMany',
    },
  );
};
