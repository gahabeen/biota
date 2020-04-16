import { FaunaUDFunctionOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export function repsert(this: Biota, udfunctionName: string) {
  const self = this;

  return async function repsertMethod(options: FaunaUDFunctionOptions = {}) {
    return execute(
      [
        {
          name: `Replace/Insert udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.repsert.call(self, udfunctionName, options));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.repsert',
      },
    );
  };
}
