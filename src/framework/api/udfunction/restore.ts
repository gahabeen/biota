import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const restore: FactoryUDFunction<FrameworkUDFunctionApi['restore']> = function (this: Biota, udfunctionName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${udfunctionName}]`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).restore());
          },
        },
      ],
      {
        domain: 'Biota.udfunction.restore',
      },
    );
  };
};
