import { FactorySession } from 'types/factory/factory.session';
import { FrameworkSessionApi } from 'types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const start: FactorySession<FrameworkSessionApi['start']> = function (expireAt = null, user = null) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Start a new session`,
          task() {
            return self.query(session(self.context)().start(expireAt, user));
          },
        },
      ],
      {
        domain: 'Biota.session.start',
      },
    );
  };
};
