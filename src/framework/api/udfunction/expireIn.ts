import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const expireIn: FactoryUDFunction<FrameworkUDFunctionApi['expireIn']> = function (udfunctionName) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${udfunctionName}] delayd of ${delay}ms`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.expireIn',
      },
    );
  };
};
