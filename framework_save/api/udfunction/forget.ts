import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { udfunction } from '~/factory/api/udfunction';
import { execute } from '~/tools/tasks';

export function forget(this: Biota, udfunctionName: string) {
  const self = this;

  return async function forgetMethod() {
    return execute(
      [
        {
          name: `Forget udfunction [${udfunctionName}]`,
          task() {
            return self.query(udfunction.forget.call(self, udfunctionName));
          },
        },
      ],
      {
        domain: 'Biota.udfunction.forget',
      },
    );
  };
}
