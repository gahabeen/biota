import { FactorySession } from 'types/factory/factory.session';
import { FrameworkSessionApi } from 'types/framework/framework.session';
import { session } from '~/factory/api/session';
import { execute } from '~/tools/tasks';

// tslint:disable-next-line: variable-name
export const delete_: FactorySession<FrameworkSessionApi['delete']> = function (idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete (${idOrRef})`,
          task() {
            return self.query(session(self.context)(idOrRef).delete());
          },
        },
      ],
      {
        domain: 'Biota.session.delete',
      },
    );
  };
};
