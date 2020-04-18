import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const repsert: FactoryUDFunction<FrameworkUDFunctionApi['repsert']> = function (udfunctionName) {
  const self = this;

  return async function repsertMethod(options) {
    return execute(
      [
        {
          name: `Replace/Insert (${udfunctionName})`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).repsert(options));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.repsert',
      },
    );
  };
};
