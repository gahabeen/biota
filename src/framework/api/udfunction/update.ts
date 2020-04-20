import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const update: FactoryUDFunction<FrameworkUDFunctionApi['update']> = function (udfunctionName) {
  const self = this;
  return async function updateMethod(data = {}) {
    return execute(
      [
        {
          name: `Update (${udfunctionName})`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).update(data));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.update',
      },
    );
  };
};
