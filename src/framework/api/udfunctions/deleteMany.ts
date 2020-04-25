import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/UDFunctions';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkUDFunctionsApi['deleteMany'] = async function (refList) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return execute(
    [
      {
        name: `Delete many UDFunctions`,
        task() {
          return self.query(udfunctions(self.context).deleteMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.UDFunctions.deleteMany',
    },
  );
};
