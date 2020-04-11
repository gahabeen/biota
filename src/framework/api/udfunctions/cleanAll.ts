import { DB } from '~/db';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';

export function cleanAll(this: DB) {
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
      domain: 'DB.udfunctions.cleanAll',
    },
  );
}
