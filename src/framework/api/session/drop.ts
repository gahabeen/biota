import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const drop: FactorySession<FrameworkSessionApi['drop']> = function (id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${id})`,
          task() {
            return self.query(session(self.context)(id).drop());
          },
        },
      ],
      {
        domain: 'Biota.session.drop',
      },
    );
  };
};
