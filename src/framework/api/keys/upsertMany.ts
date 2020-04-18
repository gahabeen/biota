import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkUDFunctionsApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many udfunctions`,
        task() {
          return self.query(udfunctions(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.upsertMany',
    },
  );
};
