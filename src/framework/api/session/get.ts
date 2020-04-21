import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const get: FactorySession<FrameworkSessionApi['get']> = function (id) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${id})`,
          task() {
            return self.query(session(self.context)(id).get());
          },
        },
      ],
      {
        domain: 'Biota.session.get',
      },
    );
  };
};
