import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkUDFunctionsApi['deleteMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many udfunctions`,
        task() {
          return self.query(udfunctions(self.context).deleteMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.deleteMany',
    },
  );
};
