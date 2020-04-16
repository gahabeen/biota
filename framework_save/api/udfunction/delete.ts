import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export function delete_(this: Biota, udfunctionName: string) {
  const self = this;

  return async function deleteMethod() {
    return execute(
      [
        {
          name: `Delete udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.delete.call(self, udfunctionName));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.delete',
      },
    );
  };
}
