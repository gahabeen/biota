import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const get: FactoryUDFunction<FrameworkUDFunctionApi['get']> = function (udfunctionName) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${udfunctionName})`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).get());
          },
        },
      ],
      {
        domain: 'Biota.udfunction.get',
      },
    );
  };
};
