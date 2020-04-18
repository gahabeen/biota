import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

// tslint:disable-next-line: variable-name
export const delete_: FactoryUDFunction<FrameworkUDFunctionApi['delete']> = function (udfunctionName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete (${udfunctionName})`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).delete());
          },
        },
      ],
      {
        domain: 'Biota.udfunction.delete',
      },
    );
  };
};
