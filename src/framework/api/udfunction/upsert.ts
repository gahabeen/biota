import { FaunaUDFunctionOptions } from '~/../types/fauna';
import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';

export function upsert(this: Biota, collectionName: string) {
  const self = this;

  return async function upsertMethod(options: FaunaUDFunctionOptions = {}) {
    return execute(
      [
        {
          name: `Update/Insert udfunction [${collectionName}]`,
          task() {
            return self.query(udfunction.upsert.call(self, collectionName, options));
          },
        },
      ],
      {
        domain: 'Biota.collection.upsert',
      },
    );
  };
}
