import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/UDFunctions';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkUDFunctionsApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many UDFunctions`,
        task() {
          return self.query(udfunctions(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.UDFunctions.upsertMany',
    },
  );
};
