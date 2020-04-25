import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const start: FactorySession<FrameworkSessionApi['start']> = function (id = null) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async (expireAt = null, user = null) => {
    return execute(
      [
        {
          name: `Start a new session`,
          task() {
            return self.query(session(self.context)(id).start(expireAt, user));
          },
        },
      ],
      {
        domain: 'Biota.session.start',
      },
    );
  };
};
