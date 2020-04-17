import { FactorySession } from 'types/factory/factory.session';
import { FrameworkSessionApi } from 'types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const forget: FactorySession<FrameworkSessionApi['forget']> = function (idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget (${idOrRef})`,
          task() {
            return self.query(session(self.context)(idOrRef).forget());
          },
        },
      ],
      {
        domain: 'Biota.session.forget',
      },
    );
  };
};
