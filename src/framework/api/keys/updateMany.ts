import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkUDFunctionsApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many udfunctions`,
        task() {
          return self.query(udfunctions(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.updateMany',
    },
  );
};
