import { FaunaUDFunctionOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';

export function replace(this: Biota, udfunctionName: string) {
  const self = this;

  return async function replaceMethod(options: FaunaUDFunctionOptions = {}) {
    return execute(
      [
        {
          name: `Replace udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.replace.call(self, udfunctionName, options));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.replace',
      },
    );
  };
}
