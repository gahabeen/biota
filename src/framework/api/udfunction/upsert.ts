import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const upsert: FactoryUDFunction<FrameworkUDFunctionApi['upsert']> = function (udfunctionName = null) {
  const self = this;

  return async function upsertMethod(options = {}) {
    return execute(
      [
        {
          name: `Update/Insert (${udfunctionName})`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).upsert(options));
          },
          // fullError: true,
        },
      ],
      {
        domain: 'Biota.udfunction.upsert',
      },
    );
  };
};
