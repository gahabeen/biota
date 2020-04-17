import { FactorySession } from 'types/factory/factory.session';
import { FrameworkSessionApi } from 'types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const repsert: FactorySession<FrameworkSessionApi['repsert']> = function (idOrRef) {
  const self = this;

  return async function repsertMethod(options) {
    return execute(
      [
        {
          name: `Replace/Insert (${idOrRef})`,
          task() {
            return self.query(session(self.context)(idOrRef).repsert(options));
          },
        },
      ],
      {
        domain: 'Biota.session.repsert',
      },
    );
  };
};
