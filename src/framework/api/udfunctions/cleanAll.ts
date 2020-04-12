import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';

export function cleanAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all udfunctions`,
        task() {
          return self.query(udfunction.cleanAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.cleanAll',
    },
  );
}
