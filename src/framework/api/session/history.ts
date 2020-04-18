import { Biota } from '~/biota';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';
import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';

export const history: FactorySession<FrameworkSessionApi['history']> = function (this: Biota, idOrRef) {
  const self = this;

  return async (pagination) => {
    return execute(
      [
        {
          name: `History of [${idOrRef}]`,
          task() {
            return self.query(session(self.context)(idOrRef).history(pagination));
          },
        },
      ],
      {
        domain: 'Biota.session.history',
      },
    );
  };
};
