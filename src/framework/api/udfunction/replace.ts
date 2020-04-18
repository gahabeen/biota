import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const replace: FactoryUDFunction<FrameworkUDFunctionApi['replace']> = function (udfunctionName) {
  const self = this;

  return async function replaceMethod(options) {
    return execute(
      [
        {
          name: `Replace (${udfunctionName})`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).replace(options));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.replace',
      },
    );
  };
};
