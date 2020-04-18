import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { FaunaId } from '~/types/fauna';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export const insert: FactoryUDFunction<FrameworkUDFunctionApi['insert']> = function (udfunctionName) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${udfunctionName}]`,
          task() {
            return self.query(udfunction(self.context)(udfunctionName).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.insert',
      },
    );
  };
};
