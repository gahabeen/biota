import { FactorySession } from 'types/factory/factory.session';
import { FrameworkSessionApi } from 'types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const expireNow: FactorySession<FrameworkSessionApi['expireNow']> = function (idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${idOrRef}] now`,
          task() {
            return self.query(session(self.context)(idOrRef).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.session.expireNow',
      },
    );
  };
};
