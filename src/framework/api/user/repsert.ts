import { FactoryUser } from 'types/factory/factory.user';
import { FrameworkUserApi } from 'types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const repsert: FactoryUser<FrameworkUserApi['repsert']> = function (idOrRef) {
  const self = this;

  return async function repsertMethod(options) {
    return execute(
      [
        {
          name: `Replace/Insert (${idOrRef})`,
          task() {
            return self.query(user(self.context)(idOrRef).repsert(options));
          },
        },
      ],
      {
        domain: 'Biota.user.repsert',
      },
    );
  };
};
