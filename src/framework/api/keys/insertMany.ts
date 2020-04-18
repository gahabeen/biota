import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkUDFunctionsApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many udfunctions`,
        task() {
          return self.query(udfunctions(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.insertMany',
    },
  );
};
