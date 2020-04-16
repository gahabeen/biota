import { FaunaUDFunctionOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export function update(this: Biota, udfunctionName: string) {
  const self = this;

  return async function updateMethod(options: FaunaUDFunctionOptions = {}) {
    return execute(
      [
        {
          name: `Update udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.update.call(self, udfunctionName, options));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.update',
      },
    );
  };
}
