import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const update: FactorySession<FrameworkSessionApi['update']> = function (idOrRef) {
  const self = this;

  return async function updateMethod(data) {
    return execute(
      [
        {
          name: `Update (${idOrRef})`,
          task() {
            return self.query(session(self.context)(idOrRef).update(data));
          },
        },
      ],
      {
        domain: 'Biota.session.update',
      },
    );
  };
};
