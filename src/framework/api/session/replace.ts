import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const replace: FactorySession<FrameworkSessionApi['replace']> = function (id) {
  const self = this;

  return async function replaceMethod(options) {
    return execute(
      [
        {
          name: `Replace (${id})`,
          task() {
            return self.query(session(self.context)(id).replace(options));
          },
        },
      ],
      {
        domain: 'Biota.session.replace',
      },
    );
  };
};
