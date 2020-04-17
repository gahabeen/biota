import { FactorySession } from 'types/factory/factory.session';
import { FrameworkSessionApi } from 'types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const get: FactorySession<FrameworkSessionApi['get']> = function (idOrRef) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${idOrRef})`,
          task() {
            return self.query(session(self.context)(idOrRef).get());
          },
        },
      ],
      {
        domain: 'Biota.session.get',
      },
    );
  };
};
