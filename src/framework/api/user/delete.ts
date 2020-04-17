import { FactoryUser } from 'types/factory/factory.user';
import { FrameworkUserApi } from 'types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

// tslint:disable-next-line: variable-name
export const delete_: FactoryUser<FrameworkUserApi['delete']> = function (idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete (${idOrRef})`,
          task() {
            return self.query(user(self.context)(idOrRef).delete());
          },
        },
      ],
      {
        domain: 'Biota.user.delete',
      },
    );
  };
};
