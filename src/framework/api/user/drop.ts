import { FactoryUser } from 'types/factory/factory.user';
import { FrameworkUserApi } from 'types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const drop: FactoryUser<FrameworkUserApi['drop']> = function (idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${idOrRef})`,
          task() {
            return self.query(user(self.context)(idOrRef).drop());
          },
        },
      ],
      {
        domain: 'Biota.user.drop',
      },
    );
  };
};
