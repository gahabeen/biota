import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { udfunctions } from '~/factory/api/udfunctions';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkUDFunctionsApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all udfunctions`,
        task() {
          return self.query(udfunctions(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.findAll',
    },
  );
};
