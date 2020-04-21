import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const passport: FactorySession<FrameworkSessionApi['passport']> = function (id) {
  const self = this;

  return async function passportMethod() {
    return execute(
      [
        {
          name: `Get passport`,
          task() {
            return self.query(session(self.context)().passport());
          },
        },
      ],
      {
        domain: 'Biota.session.passport',
      },
    );
  };
};
