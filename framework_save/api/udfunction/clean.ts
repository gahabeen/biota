import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';

export function clean(this: Biota, udfunctionName: string) {
  const self = this;

  return async function cleanMethod() {
    return execute(
      [
        {
          name: `Clean udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.clean.call(self, udfunctionName));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.clean',
      },
    );
  };
}
