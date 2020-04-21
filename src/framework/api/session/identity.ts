import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const identity: FactorySession<FrameworkSessionApi['identity']> = function (id) {
  const self = this;

  return async function identityMethod() {
    return execute(
      [
        {
          name: `Get identity`,
          task() {
            return self.query(session(self.context)().identity());
          },
        },
      ],
      {
        domain: 'Biota.session.identity',
      },
    );
  };
};
