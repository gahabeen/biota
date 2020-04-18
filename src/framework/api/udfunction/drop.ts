import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const drop: FactoryUDFunction<FrameworkUDFunctionApi['drop']> = function (udfunctionName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${udfunctionName})`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).drop());
          },
        },
      ],
      {
        domain: 'Biota.udfunction.drop',
      },
    );
  };
};
