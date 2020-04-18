import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const expireNow: FactoryUDFunction<FrameworkUDFunctionApi['expireNow']> = function (udfunctionName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${udfunctionName}] now`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.udfunction.expireNow',
      },
    );
  };
};
