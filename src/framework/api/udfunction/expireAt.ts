import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const expireAt: FactoryUDFunction<FrameworkUDFunctionApi['expireAt']> = function (udfunctionName) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${udfunctionName}] at ${at}`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.expireAt',
      },
    );
  };
};
