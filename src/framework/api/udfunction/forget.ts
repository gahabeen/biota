import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const forget: FactoryUDFunction<FrameworkUDFunctionApi['forget']> = function (udfunctionName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget (${udfunctionName})`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).forget());
          },
        },
      ],
      {
        domain: 'Biota.udfunction.forget',
      },
    );
  };
};
