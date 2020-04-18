import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const expireIn: FactorySession<FrameworkSessionApi['expireIn']> = function (idOrRef) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${idOrRef}] delayd of ${delay}ms`,
          task() {
            return self.query(session(self.context)(idOrRef).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.session.expireIn',
      },
    );
  };
};
