import { FaunaId, FaunaDocumentOptions, FaunaRoleOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';

export function insert(this: Biota, udfunctionName: string) {
  const self = this;

  return async function insertMethod(options: FaunaRoleOptions = {}) {
    return execute(
      [
        {
          name: `Insert udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.insert.call(self, udfunctionName, options));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.insert',
      },
    );
  };
}
