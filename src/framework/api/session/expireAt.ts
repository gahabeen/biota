import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const expireAt: FactorySession<FrameworkSessionApi['expireAt']> = function (idOrRef) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${idOrRef}] at ${at}`,
          task() {
            return self.query(session(self.context)(idOrRef).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.session.expireAt',
      },
    );
  };
};
