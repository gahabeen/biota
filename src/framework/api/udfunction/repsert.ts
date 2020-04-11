import { FaunaUDFunctionOptions } from '~/../types/fauna';
import { DB } from '~/db';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';

export function repsert(this: DB, udfunctionName: string) {
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
        domain: 'DB.udfunction.repsert',
      },
    );
  };
}
