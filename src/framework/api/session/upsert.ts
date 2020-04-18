import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const upsert: FactorySession<FrameworkSessionApi['upsert']> = function (idOrRef) {
  const self = this;

  return async function upsertMethod(data) {
    return execute(
      [
        {
          name: `Update/Insert (${idOrRef})`,
          task() {
            return self.query(session(self.context)(idOrRef).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.session.upsert',
      },
    );
  };
};
