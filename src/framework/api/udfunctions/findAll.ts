import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/UDFunctions';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkUDFunctionsApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all UDFunctions`,
        task() {
          return self.query(udfunctions(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.UDFunctions.findAll',
    },
  );
};
