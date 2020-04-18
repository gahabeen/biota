import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const repsertMany: FrameworkUDFunctionsApi['repsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many udfunctions`,
        task() {
          return self.query(udfunctions(self.context).repsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.repsertMany',
    },
  );
};
