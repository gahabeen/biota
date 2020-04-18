import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { Biota } from '~/biota';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

export const restore: FactorySession<FrameworkSessionApi['restore']> = function (this: Biota, idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${idOrRef}]`,
          task() {
            return self.query(session(self.context)(idOrRef).restore());
          },
        },
      ],
      {
        domain: 'Biota.session.restore',
      },
    );
  };
};
