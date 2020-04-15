import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';

export function dropAll(this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Clean all udfunctions`,
        task() {
          return self.query(udfunction.dropAll.call(self));
        },
      },
    ],
    {
      domain: 'Biota.udfunctions.dropAll',
    },
  );
}
