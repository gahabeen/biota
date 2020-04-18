import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { Biota } from '~/biota';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const remember: FactorySession<FrameworkSessionApi['remember']> = function (this: Biota, idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Remember [${idOrRef}]`,
          task() {
            return self.query(session(self.context)(idOrRef).remember());
          },
        },
      ],
      {
        domain: 'Biota.session.remember',
      },
    );
  };
};
