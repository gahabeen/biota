import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';

export function drop(this: Biota, udfunctionName: string) {
  const self = this;

  return async function dropMethod() {
    return execute(
      [
        {
          name: `Clean udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.drop.call(self, udfunctionName));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.drop',
      },
    );
  };
}
