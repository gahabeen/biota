import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const exists: FactoryUDFunction<FrameworkUDFunctionApi['exists']> = function (udfunctionName) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Exists (${udfunctionName})`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).exists());
          },
        },
      ],
      {
        domain: 'Biota.udfunction.exists',
      },
    );
  };
};
