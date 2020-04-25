import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/UDFunctions';
import { execute } from '~/tools/tasks';

export const replaceMany: FrameworkUDFunctionsApi['replaceMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many UDFunctions`,
        task() {
          return self.query(udfunctions(self.context).replaceMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.UDFunctions.replaceMany',
    },
  );
};
